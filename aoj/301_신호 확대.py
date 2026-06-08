a,b,c = map(int,input().split())
s = []

for i in range(a):
    s.append(list(input()))
s2 = []

for i in s:
    for k in range(c):
        for j in i:
            s2.append(j*c)
        s2.append('\n')

for i in s2:
    print(i, end ='')