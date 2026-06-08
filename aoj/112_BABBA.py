a = int(input())
AB = [1,0]
for i in range(a):
    AB[0],AB[1] = AB[1], AB[1]+AB[0]
print(*AB)