def my_round(x):
    if x >= 0:
        return int(x + 0.5)
    else:
        return int(x - 0.5)
N = int(input())
nan = []
for i in range(N):
    nan.append(int(input()))
sibo = int(len(nan) * 0.15 + 0.5)
nan.sort()
nan = nan[sibo:-sibo]
sum = 0
for j in nan:
    sum += j
result = my_round(sum/len(nan))
print(result)