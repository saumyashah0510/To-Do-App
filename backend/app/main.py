from fastapi import FastAPI
from . import models
from .database import engine
from .routers import todo,users,auth
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] during development
    allow_credentials=True,
    allow_methods=["*"],  # allow POST, GET, etc.
    allow_headers=["*"],  # allow Authorization, Content-Type, etc.
)


app.include_router(todo.router)
app.include_router(users.router)
app.include_router(auth.router)  
