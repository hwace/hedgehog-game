import random

while True:
    A = random.randint(0,9)
    C = random.randint(0,9)
    E = random.randint(0,9)
    N = random.randint(0,9)
    M = random.randint(0,9)
    K = random.randint(0,9)
    if A != C != E != N != M != K:
        if A*100+N*10+A + C*100+A*10+N == M*1000+A*100+K*10+E:
            print(f'a:{A} c:{C} e:{E} n:{N} m:{M} k:{K}')
            break