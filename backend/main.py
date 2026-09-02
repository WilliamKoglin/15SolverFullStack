from fastapi import FastAPI
from ASolve import boardSolve
from ASolvable import solvable
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
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

@app.post("/validate")
def valid(puzzle: BoardData):
    return {"solvable" : solvable(tuple(puzzle.board))}
