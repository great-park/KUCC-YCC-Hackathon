import pandas as pd
import json

info = pd.read_excel('notice_info.xlsx')

with open(f'user.json', 'w', encoding='utf-8') as f:
    info.to_json(f, force_ascii=False, orient='records')  

info_json = open('user.json', encoding = 'utf-8')
info_list = json.load(info_json)
print(len(info.index))



