import requests

url = 'http://10.5.5.9/videos/DCIM/100GOPRO/GOPR0420.JPG'
r = requests.get(url, stream=True)

with open('GOPR0420.JPG', 'wb') as f:
     for chunk in r.iter_content(chunk_size=1024):
          if chunk:
               f.write(chunk)
               f.flush()

