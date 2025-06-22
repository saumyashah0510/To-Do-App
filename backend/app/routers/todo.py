from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/todos",
    tags=["Todos"]
)

@router.get("/", response_model=List[schemas.TodoOut])
def get_todos(db: Session = Depends(get_db), curr_user: int = Depends(oauth2.get_current_user)):
    todos = db.query(models.Todo).filter(models.Todo.owner_id == curr_user.id).all()
    return todos


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.TodoOut)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db), curr_user: int = Depends(oauth2.get_current_user)):
    new_todo = models.Todo(owner_id=curr_user.id, **todo.dict())
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


@router.get("/{id}", response_model=schemas.TodoOut)
def get_todo(id: int, db: Session = Depends(get_db), curr_user: int = Depends(oauth2.get_current_user)):
    todo = db.query(models.Todo).filter(models.Todo.id == id).first()

    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    if todo.owner_id != curr_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return todo


@router.put("/{id}", response_model=schemas.TodoOut)
def update_todo(id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db), curr_user: int = Depends(oauth2.get_current_user)):
    todo_query = db.query(models.Todo).filter(models.Todo.id == id)
    existing_todo = todo_query.first()

    if not existing_todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    if existing_todo.owner_id != curr_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    todo_query.update(todo.dict(exclude_unset=True), synchronize_session=False)
    db.commit()
    return todo_query.first()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(id: int, db: Session = Depends(get_db), curr_user: int = Depends(oauth2.get_current_user)):
    todo_query = db.query(models.Todo).filter(models.Todo.id == id)
    todo = todo_query.first()

    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    if todo.owner_id != curr_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    todo_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.patch("/{id}/toggle", response_model=schemas.TodoOut)
def toggle_complete(id: int, db: Session = Depends(get_db), curr_user: int = Depends(oauth2.get_current_user)):
    todo = db.query(models.Todo).filter(models.Todo.id == id).first()
    if not todo or todo.owner_id != curr_user.id:
        raise HTTPException(status_code=404)
    todo.completed = not todo.completed
    db.commit()
    db.refresh(todo)
    return todo

