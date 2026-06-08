a = int(input())
num = list(map(int,input().split()))
jjak = 0
hole = 0
for i in range(a):
    if num[i]%2 == 0:
        jjak += 1
    else:
        hole += 1

if 0 <= hole-jjak <= 1:
    print('1')
else:
    print('0')