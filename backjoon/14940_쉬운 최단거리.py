import sys
from collections import deque
input = sys.stdin.readline
sys.setrecursionlimit(100000000)
n,m = map(int,input().split())
#[[2,1,1,1],[1,1,1,1],[0,1,1,0]]
road = []
for i in range(n):
    nums = list(map(int,input().split()))
    road.append(nums)
visited = [[0 for _ in range(m)] for __ in range(n)]
queue = deque()
for i in range(m):
    for j in range(n):
        if road[j][i] == 2:
            queue.append([j,i])
            visited[j][i] == 0
dx = [-1,1,0,0]
dy = [0,0,-1,1]
while queue:
    y,x = queue.popleft()
    for i in range(4):
        zx = dx[i] + x
        zy = dy[i] + y
        if 0<=zx<m and 0<=zy<n and road[zy][zx] == 1 and visited[zy][zx] == 0:
            visited[zy][zx] = visited[y][x] + 1
            queue.append([zy,zx])
for i in range(n):
    for j in range(m):
        if visited[i][j] == 0 and road[i][j] == 1:
            print('-1',end = ' ')
        else:
            print(visited[i][j],end = ' ')
    print('')