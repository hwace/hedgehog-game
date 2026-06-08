num = []
for i in range(3):
    num.append(str(input()))
for i in range(3):
    try:
        num[i] = int(num[i])
        int_num = i
    except ValueError:
        pass
print(i+(3-i))