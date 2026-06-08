a = int(input())
k = a
b = 1
for i in range(1,a+1):
    for j in range(1,k+1):
        if abs(j-k) >= b:
            print(' ',end ='')
        else:
            print('*',end = '')
    k += 1
    b+=2
    print('')