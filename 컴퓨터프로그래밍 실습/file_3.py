def can_file_open():
    file_name = str(input('입력 파일 이름:'))
    try:
        infile = open(file_name,"r")
    except:
        print(f'파일 {file_name}이 없습니다. 다시 입력하시오.')
        return can_file_open()
    print('파일이 성공적으로 열렸습니다.')

can_file_open()