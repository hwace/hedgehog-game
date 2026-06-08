num = int(input())
b = num
for i in range(1,num+1):
    for j in range(1,2*num+1):
        if abs(j-num) > b:
            print(' ',end ='')
        else:
            print(j,end ='')
    b-=1
    print('')