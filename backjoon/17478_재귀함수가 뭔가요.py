print('어느 한 컴퓨터공학과 학생이 유명한 교수님을 찾아가 물었다.')
b = 0
def What_is_Recursion(n,b):
    a = '____'
    if n == 0:
        print(a*b+'\"재귀함수가 뭔가요?\"')
        print(a*b+'\"재귀함수는 자기 자신을 호출하는 함수라네\"')
        return
    print(a*(b-n) + '\"재귀함수가 뭔가요?\"')
    print(a*(b-n) + '\"잘 들어보게. 옛날옛날 한 산 꼭대기에 이세상 모든 지식을 통달한 선인이 있었어.')
    print(a*(b-n) + '마을 사람들은 모두 그 선인에게 수많은 질문을 했고, 모두 지혜롭게 대답해 주었지.')
    print(a*(b-n) + '그의 답은 대부분 옳았다고 하네. 그런데 어느 날, 그 선인에게 한 선비가 찾아와서 물었어.\"')
    return What_is_Recursion(n-1,b)

def What_is_Recursion2(n,b):
    if n == -1:
        return
    a = '____'
    print(a*n + '라고 답변하였지.')
    return What_is_Recursion2(n-1,b)

a = int(input())
What_is_Recursion(a,a)
What_is_Recursion2(a,a)