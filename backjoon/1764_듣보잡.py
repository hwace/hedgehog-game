import sys
input = sys.stdin.readline
n,m = map(int,input().split())
eme = set()
qh = set()
for i in range(n):
    eme.add(input())
for j in range(m):
    qh.add(input())
result = list(eme&qh)
result.sort()
print(len(result))
for j in result:
    print(j,end='')