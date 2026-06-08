test_case = int(input())
for i in range(test_case):
    k = int(input())
    n = int(input())
    dp = [[0 for __ in range(n)] for _ in range(k+1)]
    for i in range(n):
        dp[0][i] = i+1
    for i in range(1,k+1):
        for j in range(n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    print(dp[-1][-1])