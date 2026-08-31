from fastapi import FastAPI
from backend.ASolve import boardSolve

app = FastAPI()

@app.get("/")
def home():
    return boardSolve()
