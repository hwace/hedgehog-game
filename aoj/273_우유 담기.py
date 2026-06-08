X, Y, M = map(int,input().split())

result = []

for i in range(M//X+1):
    if Y*i + X*(M//X-i) <= M:
        result.append(Y*i + X*(M//X-i))
print(max(result))