import sys
from collections import deque
sys.setrecursionlimit(100000)
input = sys.stdin.readline
test_case = int(input())
for case in range(test_case):
    garo,sero,baechu = map(int,input().split())
    
    #그래프 생성
    graph = [[0 for _ in range(garo)] for __ in range(sero)]
    for i in range(baechu):
        x,y = map(int,input().split())
        graph[y][x] = 1
    
    #queue 리스트 추가
    queue = deque()
    baechu_bug = 0
    for i in range(garo):
        for j in range(sero):
            if graph[j][i] == 1:
                queue.append((i,j))
                flag =True
                break
        if flag:
            break
    #BFS
    dx = [-1,1,0,0]
    dy = [0,0,1,-1]
    while queue:
        x,y = queue.popleft()
        for i in range(4):
            zx = x+dx[i]
            zy = y+dy[i]
            if 0<=zx<garo and 0<=zy<sero and graph[zy][zx] == 1:
                queue.append((zx,zy))
                graph[zy][zx] = baechu_bug + 1