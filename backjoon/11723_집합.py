import sys
input = sys.stdin.readline
write = sys.stdout.write

M = int(input())
S = 0  # 비트마스크

for _ in range(M):
    com = input().split()
    
    if com[0] == 'add':
        S |= (1 << int(com[1]))
        
    elif com[0] == 'remove':
        S &= ~(1 << int(com[1]))
        
    elif com[0] == 'check':
        if S & (1 << int(com[1])):
            write('1\n')
        else:
            write('0\n')
            
    elif com[0] == 'toggle':
        S ^= (1 << int(com[1]))
        
    elif com[0] == 'all':
        S = (1 << 21) - 2   # 1~20 모두 포함
        
    elif com[0] == 'empty':
        S = 0