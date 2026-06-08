N = int(input())
time = list(map(int,input().split()))
time.sort()
sum_time = 0
for i in range(N):
    for j in time[:i+1]:
        sum_time+=j
print(sum_time)