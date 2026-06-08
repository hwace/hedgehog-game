a = int(input())
st = list(input())
revers_st = list(reversed(st))
count = 0
if st == revers_st:
    print(0)
else:
    for i in range(a):
        if st[i] != revers_st[i]:
            count += 1
    print(int(count/2))