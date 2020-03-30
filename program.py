import glob
import re

d = {}

for filename in glob.iglob('**/*.txt', recursive=True):
	print(filename)
	with open(filename, 'r') as f:
		words = re.sub('[\s]', ' ', f.read()).split(' ')
		for word in words:
			sanit = re.sub('[^a-zA-Z\\\']+', '', word.lower())

			if sanit != "":
				if sanit in d:
					d[sanit] = d[sanit] + 1
				else:
					d[sanit] = 1

d = {k: v for k, v in sorted(d.items(), key=lambda item: item[1])}
print(d)

with open("freq.txt", 'w') as f:
	for word, freq in d.items():
		f.write(word + " " + str(freq) + "\n")
