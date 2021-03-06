from HTMLParser import HTMLParser
import urllib as url
import json
import sys
import random
import re

#try:
#    from nltk.corpus import stopwords
#except ImportError:
#    stopwords = None
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
        reg_exps = [re.compile(unicode(word), re.IGNORECASE) for word in keywords]
        for reg_exp in reg_exps:
            string = reg_exp.sub("THIS", string)
        return string
    return censor

if __name__ == "__main__":
    wiki_list = url.urlopen("http://en.wikipedia.org/wiki/" + sys.argv[1])
    encoding = wiki_list.headers.getparam('charset')
    page = wiki_list.readlines()
    parser = MyHTMLParser()
    if stopwords:
        stop = stopwords.words('english')
        keywords = [word for word in sys.argv[1].split() if word.lower() not in stop]
    else:
        stop = []
        with open("english") as f:
            for line in f.readlines():
                stop.append(line.strip())
        keywords = [word for word in sys.argv[1].split() if word.lower() not in stop]
    #print keywords
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



    

