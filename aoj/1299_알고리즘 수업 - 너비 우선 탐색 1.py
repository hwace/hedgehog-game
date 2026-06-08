from collections import deque

N,M,R = map(int,input().split())

queue = deque()
visitied = [False for i in range(N+1)]
graph = [[] for i in range(N+1)]
result = [[] for i in range(N)]
sun = 1

for i in range(M):
    a,b = map(int,input().split())
    graph[a].append(b)
    graph[b].append(a)

for i in range(N+1):
    graph[i].sort()

queue.append(R)
visitied[0] = True
visitied[R] = True
result[R-1].append(sun)
sun += 1

while queue:
    node = queue.popleft()
    for n in graph[node]:
        if not visitied[n]:
            visitied[n] = True
            queue.append(n)
            result[n-1].append(sun)
            sun+=1
for i in result:
    try:
        print(i[0])
    except:
        print('0')