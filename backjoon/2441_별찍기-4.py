a = int(input())
k = a
for i in range(1,a+1):
    for j in range(a,0,-1):
        if j > k:
            print(' ',end ='')
        else:
            print('*',end ='')
    k-=1
    print('')