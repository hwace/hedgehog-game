S = str(input())
an = 'an'
if S[0] != 'b' or S[-1] != 'a':
    print('bananakick')
else:
    if S[1:-1] == int(len(S[1:-1])/2)*an:
        print('banana')
    else:
        print('bananakick')