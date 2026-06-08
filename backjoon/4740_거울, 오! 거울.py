while True:
    s = str(input())
    if s == '***':
        break
    else:
        for i in range(len(s),-1,-1):
            print(s[i])