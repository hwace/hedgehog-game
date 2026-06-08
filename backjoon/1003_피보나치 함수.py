import sys
input = sys.stdin.readline
T = int(input())
fibonacci = [[1,0],[0,1]]
for i in range(T):
    x = int(input())
    if len(fibonacci) >= x:
        for j in fibonacci[x]:
            print(j,end=' ')
    else:
        while len(fibonacci) <= x:
            fibonacci.append([a+b for a,b in zip(fibonacci[-1],fibonacci[-2])])
        for j in fibonacci[x]:
            print(j,end=' ')