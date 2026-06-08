def pd(a):
    if a == -1:
        return
    else:
        print('pd')
        return pd(a-1)
    
a = int(input())
pd(a)