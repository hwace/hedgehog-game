test_case = int(input())
for case in range(test_case):
    x1,y1,r1,x2,y2,r2 = map(int,input().split())
    if ((x1-x2)**2 + (y1-y2)**2)**0.5 > r1+r2 or abs(r1-r2) > ((x1-x2)**2 + (y1-y2)**2)**0.5:
        print('0')
    elif ((x1-x2)**2 + (y1-y2)**2)**0.5 == r1+r2 or abs(r1-r2) == ((x1-x2)**2 + (y1-y2)**2)**0.5:
        if x1 == x2 and y1 == y2 and r1 == r2:
          print('-1')
        else:
          print('1')
    else:
        print('2')