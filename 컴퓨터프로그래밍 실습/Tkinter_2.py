from tkinter import *

def mi():
    gap = int(e1.get())
    global total
    total -= gap
    label['text'] = str(total)

def pl():
    gap = int(e1.get())
    global total
    total += gap
    label['text'] = str(total)
total = 0
window = Tk()
window.geometry('600x300')
down = Button(window, text = '감소', command = mi)
down.grid(row=0,column=0)
label = Label(window, text=str(total))
label.grid(row=0,column=1)
up = Button(window, text = '증가', command=pl)
up.grid(row=0, column=2)
label1 = Label(window, text = '변화시킬 양:')
label1.grid(row=1,column=0,columnspan=3)
e1 = Entry(window)
e1.grid(row=2,column=0,columnspan=3)

window.mainloop()