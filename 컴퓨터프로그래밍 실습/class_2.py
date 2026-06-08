class box:
    def __init__(self,l,h,d):
        self.len = l
        self.hei = h
        self.dep = d
    def __str__(self):
        return f'({self.len}, {self.hei}, {self.dep}) \n상자의 부피는 {self.len*self.hei*self.dep}'
    def setLength(self,l):
        self.len = l
    def setHeight(self,h):
        self.hei = h
    def setDepth(self,d):
        self.dep = d
    def getLength(self):
        return self.len
    def getHeight(self):
        return self.hei
    def getDepth(self):
        return self.dep
a = box(100,100,100)
print(a)