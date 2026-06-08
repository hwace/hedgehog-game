test_case = int(input())
for case in range(test_case):
    n = int(input())
    win_1 = 0
    win_2 = 0
    for i in range(n):
        P1,P2 = map(str,input().split())
        if P1 == 'R':
            if P2 == 'S':
                win_1 += 1
            elif P2 == 'P':
                win_2 += 1
        elif P1 == 'P':
            if P2 == 'R':
                win_1 += 1
            elif P2 == 'S':
                win_2 += 1
        elif P1 == 'S':
            if P2 == 'P':
                win_1 += 1
            elif P2 == 'R':
                win_2 += 1
    if win_1 > win_2:
        print("Player 1")
    elif win_1 < win_2:
        print("Player 2")
    else:
        print("TIE")