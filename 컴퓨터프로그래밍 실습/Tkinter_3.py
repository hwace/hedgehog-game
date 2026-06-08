from tkinter import *

def up():
    canvas.move(nemo,0,-10)
def down():
    canvas.move(nemo,0,10)
def left():
    canvas.move(nemo,-10,0)
def right():
    canvas.move(nemo,10, 0)

window = Tk()
frame = Frame(window, width= 600, height=630)
canvas = Canvas(window, width=600, height=400)
canvas.grid(row=0, column=0,columnspan=4)
nemo = canvas.create_rectangle(50,50,100,100,fill='red')
up = Button(window, text='상(Up)', width = 15, height= 1, command=up)
up.grid(row=1, column=0)
down = Button(window, text='하(down)', width=15, height=1, command=down)
down.grid(row=1, column=1)
left = Button(window, text='좌(Left)', width=15, height=1, command=left)
left.grid(row=1, column=2)
right = Button(window, text='우(Right)', width=15, height=1, command=right)
right.grid(row=1, column=3)

window.mainloop()