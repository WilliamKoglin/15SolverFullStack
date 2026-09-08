from fastapi import FastAPI
from backEnd.Solve import boardSolve
from shuffle import shuffle
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://one5solverfullstack.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class PuzzleData (BaseModel):
    puzz : list

class BoardData (BaseModel):
    board: list

@app.post("/solve")
def solve(puzzle: PuzzleData):
    return {"solution" : boardSolve(tuple(puzzle.puzz))}

@app.get("/shuffle")
def genBoard():
    return {"board" : shuffle()}
