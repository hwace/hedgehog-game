N = int(input())
a = 2*N + 1
str_len = int(input())
ioioi = list(map(str,input()))
count = 0
ioi = ['I','O','I']
for i in range(str_len-a):
    print(i)
    if ioi == ioioi[i:i+3]:
        count += 1
print(count)