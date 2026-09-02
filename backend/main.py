from fastapi import FastAPI
from ASolve import boardSolve
from ASolvable import solvable
from pydantic import BaseModel

app = FastAPI()

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
