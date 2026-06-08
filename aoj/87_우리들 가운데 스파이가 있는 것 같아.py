import sys
input = sys.stdin.readline

T = int(input())
for case in range(T):
    a = int(input())
    num = list(map(int,input().split()))
    b = []
    for i in range(a-1):
        if num[i] != num[i+1]:
            b.append(i+1)
    if len(b) == 1 and b[0] == 1:
        print(max(b))
    elif len(b) == 1:
        print(max(b)+1)
    else:
        print(max(b))