from AStarAlgo import traceBack, getNeighbors
from ANode import Node

# Monolithic Solve funciton
def IDASolve(init,sol):
    flimit = init.fCost
    while True:
        var = IDFS(init,flimit,sol)
        if type(var) == list:
            return var
        else:
            flimit = var
            
# Recursive function that DFS using flimit
def IDFS(node, threshold, sol):
    thresh_candidate = 1000 #reasonable max f-cost
    if node.board == sol:
        return traceBack(node)
    else:
        for item in IDNeighbors(node):
            if item.fCost <= threshold:
                tval = IDFS(item,threshold,sol)
                if type(tval) == list:
                    return tval
                if tval < thresh_candidate:
                    thresh_candidate = tval
            else:
                if thresh_candidate > item.fCost:
                    thresh_candidate = item.fCost
        return thresh_candidate
    
#return list of Nodes with boards one move away from away from node excluding pervious move.
def IDNeighbors(node):
    nodelist = []
    for item in (getNeighbors(node.board)):
        if item[1] == node.prev:
            continue
        else:
            nodelist.append(Node(item[0],node,item[1]))
    return nodelist
