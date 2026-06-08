import sys
import heapq
input = sys.stdin.readline
N = int(input())
heap = []
result = []
for i in range(N):
    x = int(input())
    if x == 0:
        if len(heap) == 0:
            result.append(0)
        else:
            result.append(heapq.heappop(heap)[1])
    else:
        heapq.heappush(heap,(x,x))
for i in result:
    print(i)