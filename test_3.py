a = int(input())
for i in range(a):
    sik, an = map(str,input().split('='))
    sik = eval(sik)
    if int(sik) == int(an):
        print('O')
    else:
        print('X')