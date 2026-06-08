from collections import deque
import sys
sys.setrecursionlimit(1000000)
input = sys.stdin.readline

N, M = map(int,input().split())

graph = [[] for i in range(N+1)]

# 그래프 만들기
for i in range(M):
    a,b = map(int,input().split())
    graph[a].append(b)
    graph[b].append(a)
for i in graph:
    i.sort()

#DFS
visited = [False for _ in range(N+1)]
visited[1] = True
result = []
result.append(1)

def DFS(start):
    for i in graph[start]:
        if not visited[i]:
            visited[i] = True
            result.append(i)
            DFS(i)
DFS(1)

print(*result)

#BFS
queue = deque([1])
visited = [False for _ in range(N+1)]
visited[1] = True
result = []
result.append(1)

while queue:
    node = queue.popleft()
    for i in graph[node]:
        if not visited[i]:
            visited[i] = True
            result.append(i)
            queue.append(i)
print(*result)