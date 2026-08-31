from math import floor,sqrt

#Finds index of blank
def findBlank(board):
    for tileIndex in range(len(board)):
        if board[tileIndex] == 0:
            return tileIndex

#Calculates misplaced tiles
def countMisTiles (board):
    count = 0
    for tileIndex in range(len(board)):
        if not (board[tileIndex]==0):
            for tile in range(tileIndex, len(board)):
                if not(board[tile] == 0):
                    if board[tileIndex] > board[tile]:
                        count = count+1
            
    return(count)

#Finds the row that contains the blank
def blankRowFind(board):
    rows = sqrt(len(board))
    index = findBlank(board)
    bRow = floor(index/rows)
    return (bRow)

#Validates solvability
def solvable(board):
    validNum = countMisTiles(board)+blankRowFind(board)
    return validNum%2 == 1
