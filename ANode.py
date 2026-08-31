from math import sqrt, floor

#Calculates F Cost by Manhattan Heuristic and adding G Cost
def getFCost(board, gCost):
    rows = int(sqrt(len(board)))
    hCost = 0
    for index in range (0,len(board)):
        curRow = floor(index/rows)
        curCol = index - (curRow*rows)

        if(board[index]==0):
            continue
        else:
            idealRow = floor((board[index]-1)/rows)
            idealCol = board[index] - (idealRow*rows) - 1
            hCost = hCost + (abs(curRow-idealRow)+abs(curCol-idealCol))            
    return hCost+gCost



class Node:
    def __init__(self, board, parent = None, prev = None):
        self.board = board
        self.parent = parent
        self.prev = prev
        if parent:
            self.gCost = parent.gCost+1
        else:
            self.gCost = 0
        self.fCost = getFCost(board, self.gCost)

    def __lt__(self,other):
        return(self.fCost<other.fCost)