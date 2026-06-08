N = int(input())
tonghwa = list(map(int,input().split()))
Y = 0
M = 0
for i in tonghwa:
    Y += i//30*10
    if i%30 != 0:
        Y += 10
    M += i//60*15
    if i%60 != 0:
        M += 15
if Y == M:
    print('Y M', Y)
elif Y < M:
    print('Y', Y)
else:
    print('M', M)