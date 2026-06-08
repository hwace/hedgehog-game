class Rectangle:
    def __init__(self,x,y,w,h):
        self.x = x
        self.y = y
        self.height = h
        self.width = w
    def __str__(self):
        return f'{self.x} {self.y} {self.width} {self.height}'
    def SetX(self,x):
        self.x = x
    def SetY(self,y):
        self.y = y
    def SetW(self,w):
        self.width = w
    def SetH(self,h):
        self.height = h
    def getX(self):
        return self.x
    def getY(self):
        return self.y
    def getH(self):
        return self.height
    def getW(self):
        return self.width
    def getArea(self):
        return self.height*self.width
    def Overlap(self,r):
        if self.x + self.width <= r.x or r.x + r.width <= self.x or self.y + self.height <= r.y or r.y + r.height <= self.y:
            return False
        else:
            return True
r1 = Rectangle(1,1,2,2)
r2 = Rectangle(5,5,2,2)
if r1.Overlap(r2):
    print('r1과 r2는 겹칩니다.')
else:
    print('r1과 r2는 겹치지 않습니다.')