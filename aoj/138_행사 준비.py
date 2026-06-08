N, A, B = map(int,input().split())
A_mar = [0]
B_mar = [0]
A_B_mar = []
Money = 0

for i in range(N):
    a,b = map(int,input().split())
    A_mar.append(a)
    B_mar.append(b)
    A_B_mar.append((a-b,i+1))
    # A_B_mar.sort(key=lambda x:(abs(x[0]-x[1])))
A_B_mar2 = sorted(A_B_mar)

for i in range(A):
    Money += A_mar[A_B_mar2[i][1]]
for i in range(1,B+1):
    Money += B_mar[A_B_mar2[-i][1]]

print(Money)