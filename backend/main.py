from fastapi import FastAPI
from ASolve import boardSolve
from pydantic import BaseModel

app = FastAPI()

class PuzzleData (BaseModel):
    puzz : list

@app.post("/solve")
def solve(puzzle: PuzzleData):
    return {"solution" : boardSolve(tuple(puzzle.puzz))}
