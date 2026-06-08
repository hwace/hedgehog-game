a = int(input())
k = 2*a
b = 2*a
for i in range(1,a+1):
    for j in range(1,k):
        if abs(j-k) >= b:
            print(' ',end ='')
        else:
            print('*',end = '')
    k -= 1
    b-=2
    print('')