from fastapi import FastAPI
from ASolve import boardSolve

app = FastAPI()

@app.get("/")
def home():
    return boardSolve()
