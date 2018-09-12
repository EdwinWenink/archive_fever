---
author: "Edwin Wenink"
title: "Webscraping my own website in Python"
date: 2018-09-12
draft: false
tags: [Webscraping,Python, BeautifulSoup]
---

Required:

- Python 3
- Python modules: requests, BeautifulSoup

A while back I suddenly felt the urge to do some quick programming after having spent the last weeks of my summer break on reading philosophy. Since I had no actual programming work to do, I decided to explore something new to me: web scraping. Web scraping is the (automated) retrieval of data from websites. If done properly, you can gather a large amount of information from a great variety of sources without any manual labour. This is for example essential for websites that compare prices, let's say for hotels or various travel tickets. In my case, despite some fantasizing about fun projects, I do not (yet) have a useful application in mind. Just for practice I decided to start with something simple: extract all blogs from my own website, and organize them nicely in a folder on my computer.

Since I'm absolutely new to this topic myself, this blog post is intended as a starters tutorial of sorts. To get started, we need some Python modules. This script is written for Python 3. 
The module `requests` (version 2.19.1) is needed because we need our script to send a request to a website to get its data, without having to open a browser ourselves. Once we have this data it is a huge unreadable mess, so we need something to parse it and recover some of its original structure. The module `BeautifulSoup` (version 4.6.0) does exactly that: it knows its way around HTML and XML, and it will provide us the data we're interested in if we ask it nicely.

```python
import requests as req
from bs4 import BeautifulSoup as bs
import os
```

We now need to give the script some necessary information: a website url of our website of interest, and the current directory we are working in so the script knows where to store the scraped blog posts. This script is only suitable for scraping my blog, and would need to be rewritten for other websites. For complex applications, you would have to 'crawl' the web to find suitable urls. In this case, I know my website and where to look. If we want to scrape blog posts, we first need to know the names of all blog posts because I want to save their contents in a text file with the right name, and secondly need to find the url of each and every blog post. Luckily, I can kill two birds with one stone (poor birds), because I have a web page called 'archives' that is a comprehensive list of all blog post names that also contains links to their respective web pages.  

So first we get the data of this 'archives' page with the `requests` module, and then let `BeautifulSoup` index its contents by creating a nice 'soup' of the requested data. From this soup we can extract the ingredients we want, which are in this case all urls from the blog posts. But we have to be precise about what we want. If you go to the archives page yourself and inspect the webpage's html using your browser, you will see that all links to the blog posts are of the class "permalink". Therefore, we can retrieve only the links we want by asking the soup to show us all html data of class "permalink".

```
base_url = "https://edwinwenink.xyz/archives/"
script_dir = os.path.dirname(os.path.abspath(__file__))

# Find the URL's of my posts
r = req.get(base_url)
soup = bs(r.text, "lxml")
links = soup.find_all(class_="permalink")
```

We now have a list of links. Every link contains text shown on the web page (i.e. the title of the blog post) and the url to which it refers (which we need for navigating to the proper web page). Because I do not only want to scrape blog content blindly, but also organized all scraped text in a text file with the proper name, I will save both the title and url of each blog post. `BeautifulSoup` knows how links work, so for each link we can simply retrieve the actual url reference entered after 'href' tag, and the text itself as such:

```python
# Record url and name of each blogpost
blog_urls = []
blog_names = []
for link in links:
    blog_urls.append(link.get('href'))
    blog_names.append(link.text)
```

Now that we have the urls of all blog posts, we can simply iterate over them to apply the scraping process, which is similar to how we scraped the 'archives' page. We are interesting in the parts of the blog that contain content, which are always contained within the `p` html tag. I wrote some extra code for saving everything to disk in an organized manner. For each blog, we select the right blog name from the names we saved before, and use it as the title of the .txt file we create. Other than that, we need to know where to save the files. I use the `os` module to create an appropriate path and make a directory called 'Scraped Posts' to save all the blog post contents in.

```python
for i, url in enumerate(blog_urls):
    r = req.get(url)
    soup = bs(r.text, "lxml")
    content = soup.find_all('p')

    # Create file to save scraped blogposts
    filename = blog_names[i]+".txt"
    path = os.path.join(os.path.sep, script_dir, 'Scraped Posts', filename)
    os.makedirs(os.path.join(script_dir, 'Scraped Posts'), exist_ok=True)
    target_file = open(path, "w")
  
    # Write the scraped blogpost to file on disk
    for text in content:
        target_file.writelines(text.get_text())
```

Voila! Could this have done better? Yes, surely. But perhaps it is nice for anyone wanting to try out web scraping to see how another beginner approached it during a casual late-night programming session.
