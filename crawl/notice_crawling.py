from dataclasses import dataclass
from bs4 import BeautifulSoup as bs
import requests
import pandas as pd
import numpy as np
import openpyxl 
from io import BytesIO
from PIL import Image
import base64


def make_url(page):
    return f"https://www.yonsei.ac.kr/sc/support/notice.jsp?mode=list&board_no=15&pager.offset={page}"


def fetch(page):
    url = make_url(page)
    page = requests.get(url)  
    return page.text


def crawl(page):
    text = fetch(page)
    return parse(text)


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


def crawl_all():
    for page in range(0, 11, 10):
        yield from crawl(page)

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



if __name__ == "__main__":
    articles = list(crawl_all())
    print(articles)

    df = pd.DataFrame(articles).drop_duplicates(subset=['title'])

    df["text_info"] = df["link"].apply(get_info)
   
    df.to_excel('notice_crawl.xlsx', index=False)
