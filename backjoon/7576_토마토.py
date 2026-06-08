from collections import deque
M,N = map(int,input().split())
baguni = [list(map(int,input().split())) for _ in range(N)]

queue = deque()
for i in range(N):
    for j in range(M):
        if baguni[i][j] == 1:
            queue.append((i,j))
dx = [-1,1,0,0]
dy = [0,0,1,-1]
while queue:
    x,y = queue.popleft()
    for i in range(4):
        nx = x+dx[i]
        ny = y+dy[i]
        if 0<=nx<N and 0<=ny<M and baguni[nx][ny] == 0:
            baguni[nx][ny] = baguni[x][y] + 1
            queue.append((nx,ny))
result = 0
for i in range(N):
    for j in range(M):
        if baguni[i][j] == 0:
            result = -1
        else:
            if result != -1:
                result = max(result,baguni[i][j]-1)
print(result)