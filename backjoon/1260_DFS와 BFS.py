from collections import deque
import sys
input = sys.stdin.readline
sys.setrecursionlimit(3000)
computer, connect, start = map(int,input().split())

#그래프 만들기
graph = [[]for _ in range(computer+1)]
for i in range(connect):
    a,b = map(int,input().split())
    graph[a].append(b)
    graph[b].append(a)

#그래프 정렬
for i in range(len(graph)):
    graph[i].sort()

#DFS
def DFS(graph,start,visited):
    visited[start] = True
    print(start,end = ' ')
    for connect in graph[start]:
        if not visited[connect]:
            DFS(graph,connect,visited)
visited = [False for _ in range(computer+1)]
visited[start] = True
DFS(graph,start,visited)
print('')

#BFS
queue = deque([start])
visited = [False for _ in range(computer+1)]
visited[start] = True
print(start,end = ' ')
while queue:
    node = queue.popleft()
    for i in graph[node]:
        if not visited[i]:
            
            visited[i] = True
            queue.append(i)
            print(i, end = ' ')