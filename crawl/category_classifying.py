import pandas as pd
import numpy as np

info = pd.read_excel('notice_crawl.xlsx')

map_dictionary = {'교목실':'기독교 선교 활동', '생활관':'기숙사','RC교육원':'기숙사', '외국어학당':'외국어학당',\
    '시설처':'학교관련 시설', '피트니스센터':'학교관련 시설', '창업지원단':'창업'}

info['category'] = info['department'].map(map_dictionary)

keywords = ['학점교류', '등록금', '전공', '졸업', '셔틀버스', '수강']

count = len(info['title'])
col = len(info.columns) -1

for word in keywords:
    key_title = info['title'].str.contains(word)
    for x in range(count):
        if key_title[x]:
            info.iloc[x,col] = word

info.to_excel('notice_info.xlsx', index=False)
