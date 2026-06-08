import sys
sys.setrecursionlimit(1000000)

N,M,R = map(int,input().split())
graph = [[] for i in range(N+1)]
visited = [False for i in range(N+1)]
result = [[] for i in range(N+1)]
order = 1

for i in range(M):
    a,b = map(int,input().split())
    graph[a].append(b)
    graph[b].append(a)

for i in range(N+1):
    graph[i].sort()

def dfs(start):
    global order
    for n in graph[start]:
        if not visited[n]:
            result[n].append(order)
            order += 1
            visited[n] = True
            dfs(n)

visited[R] = True
result[R] = [1]
order += 1
dfs(R)

for i in result[1:]:
    try:
        print(i[0])
    except:
        print('0')