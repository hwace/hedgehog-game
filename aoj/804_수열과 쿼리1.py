N, Q = map(int,input().split())
num = list(map(int,input().split()))
num2 = [0]
for i in range(N):
    num2.append(num2[i]+num[i])

for i in range(Q):
    a, b= map(int,input().split())
    if a == b:
        print(num2[a])
    else:
        print(num2[b]-num2[a-1])