M, N = map(int,input().split())
memo = {}
for i in range(M):
    site, bibeon = map(str,input().split())
    memo[site] = bibeon
for j in range(N):
    chatgi = str(input())
    print(memo[chatgi])