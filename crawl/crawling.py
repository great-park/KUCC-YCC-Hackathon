from dataclasses import dataclass
from bs4 import BeautifulSoup as bs
import requests
import pandas as pd
import numpy as np
import openpyxl 


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

    @property
    def link(self):
        return f'https://www.yonsei.ac.kr/sc/support/notice.jsp{self.href}'

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
        href = notice.find("a")["href"]
        date = (
            notice.find("span", class_="title")
            .find_all("span", class_="tline")[1]
            .get_text()
            .strip()
        )

        yield Article(title, department, href, date)


def crawl_all():
    for page in range(0, 11, 10):
        yield from crawl(page)

if __name__ == "__main__":
    articles = list(crawl_all())
    print(articles)

    df = pd.DataFrame(articles)

    df.to_excel('notice_crawl.xlsx', index=False)
