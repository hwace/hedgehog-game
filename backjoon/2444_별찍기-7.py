num = int(input())
k = num
b = num-2
for i in range(1,num+1):
    for j in range(k):
        if j > b:
            print('*',end ='')
        else:
            print(' ',end ='')
    b -= 1
    k+=1
    print('')
k = 2*num
b = 1
for i in range(1,num+1):
    for j in range(1,k-1):
        if j > b:
            print('*',end='')
        else:
            print(' ',end = '')
    b +=1
    k-=1
    print('')