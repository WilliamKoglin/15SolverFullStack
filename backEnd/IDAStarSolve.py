from solvable import solvable
from ANode import Node
from IDAStarAlgo import IDASolve


def IDAStarSolve(puzzle):
    testNode = Node(puzzle)
    sol = ((1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0))
    if (solvable(testNode.board)):
        return(IDASolve(testNode,sol))
    else:
        return("Board Not Solvable")

# Debugging option
if __name__ == "__main__":
    print(IDAStarSolve((1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15)))
