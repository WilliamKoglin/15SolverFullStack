from solvable import solvable
from random import randint

def generateBoard():
    nums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    board = []
    for x in range(16):
        tile = nums.pop(randint(0,len(nums)-1))
        board.append(tile)
    return board

def shuffle():
    while True:
      board = tuple(generateBoard())
      try:
        if solvable(board):
            return list(board)
      except:
         print("Error")
         print(board)  
