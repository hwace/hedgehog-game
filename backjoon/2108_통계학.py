import sys
input = sys.stdin.readline

n = int(input())
num = []
count = [0 for _ in range(8002)]
sum = 0

for i in range(n):
    a = int(input())
    sum += a
    num.append(a)
    count[a+4000] += 1

print(round(sum/n))
num.sort()
print(num[int(n/2)])

max_value = max(count)
modes = [i for i, v in enumerate(count) if v == max_value]
if len(modes) >= 2:
    print(modes[1]-4000)
else:
    print(modes[0]-4000)
print(max(num)-min(num))