import pandas as pd

df = pd.read_csv("C:\\Users\\a0103\\asdf\\컴퓨터프로그래밍 실습\\countries.csv")

df = df.set_index("Code")
print('--- 3번 결과 ---')
print(df[["Area", "Population"]])