import sys
input = sys.stdin.readline
n = int(input())
gedan = []
sebeon = 0
result = 0
for i in range(n):
    gedan.append(int(input()))
while gedan:
    if gedan[0] <= gedan[1] or sebeon == 2:
        result += gedan[1]
        