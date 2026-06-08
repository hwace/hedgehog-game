si_mbti = str(input())
a = int(input())
count = 0
for i in range(a):
    hu_mbti = str(input())
    if si_mbti == hu_mbti:
        count += 1
print(count)