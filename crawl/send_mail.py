import pandas as pd
from get_user_info import user_info
import json
import requests


announcement_df = pd.read_excel("/Users/shinjihyun/Desktop/python/hackathon_organized/notice_info.xlsx")


def filter_category(df, category):
    df = df[df["category"] == category]
    return df



def category_per_user(df, user_info):
    for i in range(len(user_info)):
        email = user_info[i][0]
        categories = user_info[i][1:]   
        for t in range(len(categories)):
            user_df = filter_category(df, categories[t])

            with open('user.json', 'w', encoding='utf-8') as f:
                user_df.to_json(f, force_ascii=False, orient='records')
            
            info_json = open('user.json', encoding = 'utf-8')
            info_list = json.load(info_json)

            for j in range(len(info_list)):
                info = info_list[j]
                url = f"http://13.125.244.198/sendMail?email={email}"
                contents = info
                r = requests.post(url, data=contents)
    
    


category_per_user(announcement_df, user_info)