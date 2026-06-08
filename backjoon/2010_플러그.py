import sys
input = sys.stdin.readline
n = int(input())
sum = 0
for i in range(n):
    sum += int(input()) -1
print(sum+1)