N = int(input())
a = list(map(int,input().split()))

darum = 0

b = sorted(a)

if a == b:
    print('0')
else:
    for i in range(N):
        if a[i] != b[i]:
            darum = i
            break

    print(len(a[darum:]))