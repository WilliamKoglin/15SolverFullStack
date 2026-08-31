from backend.ASolvable import solvable
from backend.ANode import Node
from backend.AStarAlgo import AStarSolve


def boardSolve():
    testNode = Node((1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15))
    sol = ((1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0))
    if (solvable(testNode.board)):
        return(f'Solution: {AStarSolve(testNode,sol)}')
    else:
        return("Board Not Solvable")

# Debugging option
if __name__ == "__main__":
    print(boardSolve())
