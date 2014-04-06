from HTMLParser import HTMLParser
import urllib as url
import json
import sys
import random

try:
    from nltk.corpus import stopwords
except ImportError:
    stopwords = None
class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.result_list = []
        self.categories_list = []
        self.current_string= ""
        self.ignore = True
        self.categories = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "p":
            self.ignore = False
        elif 'id' in attrs and attrs['id'] == "catlinks":
            self.categories = True

    def handle_data(self, data):
        if not self.ignore:
            self.current_string += data
        elif self.categories:
            self.categories_list.append(data)

    def handle_endtag(self, tag):
        if tag == "p":
            if len(self.current_string) > 0:
                self.result_list.append(self.current_string)
            self.current_string = ""
            self.ignore = True
        if tag == "div":
            self.categories = False

def censor_func(keywords):
    def censor(string):
        for word in keywords:
            string = string.replace(word, "this")
        return string
    return censor

if __name__ == "__main__":
    wiki_list = url.urlopen("http://en.wikipedia.org/wiki/" + sys.argv[1])
    encoding = wiki_list.headers.getparam('charset')
    page = wiki_list.readlines()
    parser = MyHTMLParser()
    if stopwords:
        stop = stopwords.words('english')
        keywords = [word for word in sys.argv[1].split() if word not in stop]
    else:
        keywords = None
    for line in page:
        line = line.decode(encoding)
        parser.feed(line)
    #g = open(sys.argv[2], "w")
    if keywords is not None:
        parser.result_list = map(censor_func(keywords), parser.result_list)
    #for elem in parser.result_list:
    #    g.write(elem+"\n")
    return_dict = {}
    for i in range(1, 4):
        return_dict["hint"+str(i)] = parser.result_list.pop(random.randint(0, len(parser.result_list) - 1))
    return_dict["article"] = sys.argv[1]
    return_dict["category"] = random.choice(parser.categories_list)
    sys.stdout.write(json.dumps(return_dict))



    

