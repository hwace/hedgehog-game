arr = [1,2,3,4,5,6,8,9,10]
print(f'원래 리스트: \n{arr}')
arr_even = list(filter(lambda x: x%2 == 0, arr))
arr_odd = list(filter(lambda x: x%2 == 1, arr))
print(f'짝수: \n{arr_even}')
print(f'홀수: \n{arr_odd}')