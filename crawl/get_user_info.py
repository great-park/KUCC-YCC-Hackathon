import requests, json

url = requests.get("http://13.125.244.198/users")
text = url.text
json_data = json.loads(text)


user_info = []

for i in range(len(json_data)):
    user_ls = []
    email = json_data[i]["email"]
    user_ls.append(email)
    keyword_dict = json_data[i]["Keyword"]
    for t in range(len(keyword_dict)):
        keyword = keyword_dict[t]["keyword"]
        user_ls.append(keyword)
    user_info.append(user_ls)

print(user_info)