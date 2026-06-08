n = int(input())
num = 1
n_a = 1
n_b = 1

for i in range(n):
    a,b = map(str,input().split())
    if a[0] == '+':
        n_a = num + int(a[1:])
    else:
        n_a = num * int(a[1:])
    if b[0] == '+':
        n_b = num + int(b[1:])
    else:
        n_b = num * int(b[1:])
    num = max(n_a,n_b)
print(num)