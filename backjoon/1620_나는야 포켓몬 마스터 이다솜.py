N,M = map(int,input().split())
dogam = dict()
for i in range(N):
    dogam[i] = str(input())
reverse = {v:k for k,v in dogam.items()}
for j in range(M):
    Q = input()
    try:
        Q = int(Q)
        print(dogam[Q-1])
    except ValueError:
        print(reverse[Q]+1)