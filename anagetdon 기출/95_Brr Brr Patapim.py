h1, m1 = map(int,input().split(':'))
h2, m2 = map(int,input().split(':'))

result = 0
si = False

if abs(h1 - h2) > 24+min(h1,h2) - max(h1,h2): # 시계 방향으로 시침을 돌리는 횟수 > 반시계 방향으로 돌리는 횟수
    result += 24+min(h1,h2) - max(h1,h2)
    si = True
else:
    result = abs(h1-h2)

print('시침 움직인 횟수: ',result)

if m1 - m2 < -30:
    if si:
        result -= 1
        result += 60+m1 - m2
    else:
        result += 1
        result += 60+m1 - m2
if m1 - m2 > 30:
    result += 60+m2 - m1
else:
    result += abs(m1 - m2)

print(result)