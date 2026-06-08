N, K = map(int,input().split())
dong_dan = []
count = 0
time = 0
for i in range(N):
    dong_dan.append(int(input())) #화폐 단위 받기
for j in range(N-1,-1,-1): #오름차순으로
    if int(K)//dong_dan[j] >= 1: #K를 나눴을 때 몫이 1 이상일 때
        count += int(K)//dong_dan[j] #K를 나눈 값을 count
        time = K//dong_dan[j]
        K = K-dong_dan[j]*time
print(count)