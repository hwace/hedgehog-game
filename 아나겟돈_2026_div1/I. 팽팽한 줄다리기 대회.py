N = int(input())
aj = list(map(int, input().split()))
dif = 999

for n in range(N):
    left_f = sum(aj[i] for i in range(n+1))
    right_f = sum(aj) - left_f

    if dif > abs(left_f - right_f):
        m = n
    dif = min(dif, abs(left_f - right_f))

print(dif, m)