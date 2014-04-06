import random
import sys

def random_line(afile):
	line = next(afile)
	for num, aline in enumerate(afile):
		if random.randrange(num + 2):
			continue
		line = aline
	return line

if __name__ == "__main__":
	sys.stdout.write(random_line(open('top_pages.txt', 'r')).replace('\n', ''))