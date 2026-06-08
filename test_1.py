n = int(5)
arr = [3,2,4,1,5]

for j in range(1,n):
    i = 0
    while arr[j] > arr[i]:
        i += 1
    m = arr[j]
    for k in range(j-i):
        arr[j-k] = arr[j-k-1]
    arr[i] = m

print(arr)