import sys
input = sys.stdin.readline
n,m = map(int,input().split())
nums = list(map(int,input().split()))
prefixsum = [nums[0]]
for i in range(1,len(nums)):
    prefixsum.append(prefixsum[i-1]+nums[i])
result = []
for i in range(m):
    a,b = map(int,input().split())
    if a == 1:
        result.append(prefixsum[b-1])
    else:
        result.append(prefixsum[b-1]-prefixsum[a-2])
print('\n'.join(map(str, result)))