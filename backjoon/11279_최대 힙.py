import sys
import heapq
input = sys.stdin.readline
N = int(input())
heap = []

result = []
for i in range(N):
    a = int(input())
    if a == 0:
        if len(heap) == 0:
            result.append(0)
        else:
            result.append(heapq.heappop(heap)[1])
    else:
        heapq.heappush(heap,(-a,a))
for i in result:
    print(i)