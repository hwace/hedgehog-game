from collections import deque
N = int(input())
queue = deque()
result = []
for i in range(N):
    comend = list(map(str,input().split()))
    if comend[0] == 'push':
        queue.append(comend[1])
    elif comend[0] == 'pop':
        if queue:
            result.append(queue.popleft())
        else:
            result.append(-1)
    elif comend[0] == 'size':
        result.append(len(queue))
    elif comend[0] == 'empty':
        if queue:
            result.append(0)
        else:
            result.append(1)
    elif comend[0] == 'front':
        if queue:
            result.append(queue[0])
        else:
            result.append(-1)
    elif comend[0] == 'back':
        if queue:
            result.append(queue[-1])
        else:
            result.append(-1)
for j in result[:]:
    print(j)