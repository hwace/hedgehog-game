N, M = map(int,input().split())
card = list(map(int,input().split()))

result = set()

for i in range(0,N-2):
  for j in range(1,N-1):
    for k in range(2,N):
      if i != j != k:
        result.add(card[i]+card[j]+card[k])

result = list(result)
result.sort()
answer = 0
for i in result:
  if i > M:
    print(answer)
    break
  elif i == M:
    print(i)
    break
  elif len(result) == 1:
    print(result[0])
  else:
    answer = i