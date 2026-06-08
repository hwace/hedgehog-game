class MyEnumerate:
    def __init__(self, string):
        self.string = string

    def __iter__(self):
        for index in range(len(self.string)):
            yield (index, self.string[index])

for index, letter in MyEnumerate('abc'):
    print(f'{index} : {letter}')