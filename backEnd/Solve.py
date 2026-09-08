from ASolvable import solvable
from ANode import Node
from AStarAlgo import AStarSolve
from IDAStarAlgo import IDASolve


def boardSolve(puzzle):
    testNode = Node(puzzle)
    sol = ((1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0))
    if (solvable(testNode.board)):
        return(IDASolve(testNode,sol))
    else:
        return("Board Not Solvable")

# Debugging option
if __name__ == "__main__":
    print(boardSolve((1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15)))
