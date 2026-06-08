from collections import deque
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10000000)

mini, sa_len = map(int,input().split())
mini_jwa = [()]
for i in range(mini):
    x,y = map(int,input().split())
    mini_jwa.append([x,y])
start = int(input())

graph = [[] for _ in range(mini+1)]

for i in range(mini+1):
    for j in range(mini+1):
        if mini_jwa[i] != mini_jwa[j]:
            if ((mini_jwa[i][0]-mini_jwa[j][0])**(2) + (mini_jwa[i][1]-mini_jwa[j][1])**(2))**(1/2) <= sa_len:
                graph[i].append(j)
                graph[j].append(i)
print(graph)