from collections import deque
import sys
input = sys.stdin.readline
computer = int(input())
connect = int(input())
con_list = [[] for _ in range(computer+1)]
queue = deque()
for i in range(connect):
    a,b = map(int,input().split())
    if a > b:
        a,b = b,a
    con_list[a].append(b)
    con_list[b].append(a)
queue.append(1)
visited = []
count = 0
while queue:
    virus = queue.popleft()
    for i in con_list[virus]:
        if i not in visited:
            visited.append(i)
            queue.append(i)
            count += 1
print(count)