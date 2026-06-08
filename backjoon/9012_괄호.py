def is_real_rhkf(rhkf_list):
    used_rhkf = []
    for i in rhkf_list:
        if i == '(':
            used_rhkf.append(1)
        else:
            if not used_rhkf:
                return False
        used_rhkf.pop()
    return len(rhkf_list) == 0
test_case = int(input())
for case in range(test_case):
    rhkf = list(map(str,input()))
    if is_real_rhkf:
        print('YES')
    else:
        print("NO")