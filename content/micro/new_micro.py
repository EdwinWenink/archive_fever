import datetime
import urllib.parse
from pathlib import Path

metainfo = {}

title = input("Enter post title: ")
metainfo['title'] = title
target = input("Enter target URL: ")
metainfo['target'] = target
now = datetime.datetime.now()
# metainfo['date'] = "{}-{}-{}T{}:{}:00".format(now.year, now.month, now.day, now.hour, now.minute)  # Format properly
metainfo['date'] = now.strftime("%Y-%m-%dT%H:%M:%S+02:00")
metainfo['type'] = "micro"

print(""""
    Options:
    1: reply
    2: bookmark
    3: event
    """)

ready = False
while not ready:
    cmd = input("Enter option: ")
    ready = True
    if int(cmd) == 1:
        metainfo['reply'] = 'true'
    elif int(cmd) == 2:
        metainfo['bookmark'] = 'true'
    elif int(cmd) == 3:
        metainfo['event'] = 'true'
        print("""
    Category:
    1: Music
     """)
        category = input("Enter option: ")
        if int(category) == 1:
            metainfo['category'] = "music"
    elif int(cmd) == 4:
        metainfo["note"] = "true"
    else:
        print("Enter a valid option")
        ready = False

filename = "./{}-{}-{}-{}.md".format(now.year, now.month, now.day, urllib.parse.quote_plus(title) ) 
# Tijd gaat mis fout: 04 wordt 4. Testen met Hugo
filepath = Path(filename)
print(filepath)

with open(filepath, "w") as micro:
    micro.write("---\n")
    for key, value in metainfo.items():
        micro.write("{}: {}\n".format(key, value))
    micro.write("---\n")

