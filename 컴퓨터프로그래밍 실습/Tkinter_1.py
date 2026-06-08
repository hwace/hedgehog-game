from tkinter import *

def process():
    label['text'] = 'Clicked'

window = Tk()
window.geometry('600x300')
label = Label(window, text='Hi')
label.pack()
button = Button(window, text='Click Me', command=process)
button.pack()

window.mainloop()