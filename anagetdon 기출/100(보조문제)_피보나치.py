import sys
sys.setrecursionlimit(100000)

fi = [0,1,1]
n = int(input())

for i in range(n-1):
    fi[(i+2)%3] = fi[i%3] + fi[(i+1)%3]
print(fi[n%3])