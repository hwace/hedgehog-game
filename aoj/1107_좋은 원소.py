from itertools import combinations_with_replacement

N = int(input())
num = list(map(int,input().split()))
result = 0

two_sum = [x+y for x in num for y in num]

if N == 1:
    print('0')
else:
    for i in range(N):
        for j in combinations_with_replacement(num[:i], 3):
            if sum(j) == num[i]:
                result += 1
                break

print(result)