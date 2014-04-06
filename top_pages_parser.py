from HTMLParser import HTMLParser
import urllib as url
import json

class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.result_list = []
        self.abbr = ""
        self.ignore = True
        self.counter = 0
        self.include = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "table" and attrs['class'] == "wikitable sortable":
            self.ignore = False
            return
        elif not self.ignore:
            if tag == "tr":
                self.counter = 0
            elif tag == "td":
                if self.counter == 1:
                    self.include = True
                self.counter += 1
    def handle_data(self, data):
        if self.include:
            self.result_list.append(data)
            self.include = False
    def handle_endtag(self, tag):
        if tag == "table":
            self.ignore = True



if __name__ == "__main__":
    wiki_list = url.urlopen("http://en.wikipedia.org/wiki/Wikipedia:5000").readlines()
    parser = MyHTMLParser()
    for line in wiki_list:
        parser.feed(line)
    g = open("top_pages.txt", "w")
    for elem in parser.result_list:
        g.write(elem+"\n")




    

