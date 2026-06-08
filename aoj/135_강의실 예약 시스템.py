import sys
input = sys.stdin.readline

N,M = map(int,input().split())
class_list = [[] for _ in range(N+1)]

for i in range(M):
    can_class = True
    class_num, start, end = map(int,input().split())
    for i in range(start,end):
        if i not in class_list[class_num]:
            class_list[class_num].append(i)
        else:
            can_class = False
            
            
    if can_class:
        print('YES')
    else:
        print('NO')