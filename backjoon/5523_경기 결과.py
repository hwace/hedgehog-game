import sys
input = sys.stdin.readline
n = int(input())
win_1 = 0
win_2 = 0
for i in range(n):
    n1, n2 = map(int,input().split())
    if n1 > n2:
        win_1 += 1
    elif n2 > n1:
        win_2 += 2
print(win_1,win_2)