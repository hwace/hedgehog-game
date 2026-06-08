import sys
input = sys.stdin.readline
N = int(input())
jwapyo_list = list(map(int,input().split()))
jwapyo_apchuk = sorted(set(jwapyo_list))
jwapyo_dict = dict()
for i in range(len(jwapyo_apchuk)):
    jwapyo_dict[jwapyo_apchuk[i]] = i

for i in jwapyo_list:
    print(jwapyo_dict[i],end = ' ')