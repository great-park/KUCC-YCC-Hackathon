# Crawling

1. [연세대학교 공지사항](https://www.yonsei.ac.kr/sc/support/notice.jsp)에서 p.2 까지 크롤링
2. 공지사항별 제목에 있는 키워드 및 업로한 부서에 따른 category column 추가
3. 유저 데이터를 가져온 후 유저의 관심 카테고리에 따른 이메일 전송

***

### 1. 공지사항 크롤링
python beautifulsoup를 사용하여 연세대학교 공지사항을 p.2 까지 크롤링한다.  

url 가져오기:
```python
def make_url(page):
    return f"https://www.yonsei.ac.kr/sc/support/notice.jsp?mode=list&board_no=15&pager.offset={page}"


def fetch(page):
    url = make_url(page)
    page = requests.get(url)  
    return page.text
```

parsing:

```python
@dataclass
class Article:
    title: str
    department: str
    link: str
    date: str

def parse(text):
    soup = bs(text, "html.parser")
    notices = soup.find("ul", class_="board_list").find_all("li")

    for notice in notices:
        if "class" in notice.attrs:
            title = (
                notice.find("a")
                .find("strong")
                .encode_contents()
                .decode("utf-8")
                .strip()
                .split("</em>")[1]
                .strip()
            )
        else:
            title = notice.find("a").find("strong").get_text().strip()
        department = (
            notice.find("span", class_="title")
            .find_all("span", class_="tline")[0]
            .get_text()
            .strip()
        )
        link = 'https://www.yonsei.ac.kr/sc/support/notice.jsp' + notice.find("a")["href"]
        date = (
            notice.find("span", class_="title")
            .find_all("span", class_="tline")[1]
            .get_text()
            .strip()
        )

        yield Article(title, department, link, date)
        
```
공지사항별 내용 가져오기:
```python
def get_info(url):
    res = requests.get(url)
    raw = res.text

    soup = bs(raw, "html.parser")
    infos = soup.find("div", {"class": "fr-view"})
    p = infos.find_all("p")

    text_ls = []
    for i in p:
        text_ls.append(i.get_text())

    text = "<br>".join(text_ls)

    return text
```

p.2 까지 크롤링:
```python
def crawl(page):
    text = fetch(page)
    return parse(text)

def crawl_all():
    for page in range(0, 11, 10):
        yield from crawl(page)
```

메인코드 실행:
```python
if __name__ == "__main__":
    articles = list(crawl_all())
    print(articles)

    df = pd.DataFrame(articles).drop_duplicates(subset=['title'])

    df["text_info"] = df["link"].apply(get_info)
   
    df.to_excel('notice_crawl.xlsx', index=False)
```

#

### 2. Category column 추가
- 공지사항별 제목에 있는 키워드나 부서에 따라서 카테고리를 분류한다.
- 카테고리는 **총 11개**로 분류한다.
- category = ['학점교류', '등록금', '전공', '졸업', '셔틀버스', '수강', '기숙사', '창업', '학교관련 시설', '기독교 선교 활동', '외국어학당']

크롤링한 데이터 가져오기:
```python
info = pd.read_excel('notice_crawl.xlsx')
```

부서에 따른 카테고리 분류:
```python
map_dictionary = {'교목실':'기독교 선교 활동', '생활관':'기숙사','RC교육원':'기숙사', '외국어학당':'외국어학당',\
    '시설처':'학교관련 시설', '피트니스센터':'학교관련 시설', '창업지원단':'창업'}

info['category'] = info['department'].map(map_dictionary)
```

제목에 있는 키워드에 따른 카테고리 분류:
```python
keywords = ['학점교류', '등록금', '전공', '졸업', '셔틀버스', '수강']

count = len(info['title'])
col = len(info.columns) -1

for word in keywords:
    key_title = info['title'].str.contains(word)
    for x in range(count):
        if key_title[x]:
            info.iloc[x,col] = word
```

카테고리 추가한 dataframe 정리:
```python
info.to_excel('notice_info.xlsx', index=False)
```

#

### 3. 유저에게 공지사항 알림 이메일 전송
- 서버 DB로부터 유저 데이터를 가져온후, 유저의 관심 카테고리에 따라서 그에 맞는 공지사항을 이메일로 전송한다.  
- 유저 데이터는 '이메일 주소'와 '관심 카테고리' 이렇게 두 가지를 포함한다.

유저 데이터 가져오기:
```python
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
```

카테고리에 따른 정보 처리:
```python
def filter_category(df, category):
    df = df[df["category"] == category]
    return df
```

유저에게 이메일 전송:
```python
announcement_df = pd.read_excel("notice_info.xlsx")

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
```



