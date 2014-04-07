stops = []
with open("english") as f:
    for line in f.readlines():
        stops.append(line.strip())
print stops
