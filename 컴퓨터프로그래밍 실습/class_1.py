class cat:
    def __init__(self,name,age):
        self.name = name
        self.age = age
    def __str__(self):
        return f'{self.name} {self.age}'
    def setName(self,name):
        self.name = name
    def getName(self):
        return self.name

a = cat('Missy',3)
b = cat('Lucky', 5)

print(a)
print(b)