import random

outfile = open("C:\\Users\\a0103\\asdf\\컴퓨터프로그래밍 실습\\output.txt", "w")
for i in range(10):
    a = random.randint(1, 100)
    outfile.write(str(a) + "\n")

outfile.close()