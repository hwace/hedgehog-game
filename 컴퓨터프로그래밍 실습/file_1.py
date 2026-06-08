infile = open("C:\\Users\\a0103\\asdf\\컴퓨터프로그래밍 실습\\file\\input.txt", "r")
line = infile.readline()
len_line = 0
max_len_line = ''
while line != "":
    if len(line) > len_line:
        max_len_line = line
        len_line = len(line)
    line = infile.readline()
infile.close()
print(f'가장 긴 단어는 {max_len_line.strip()}입니다.')