# Simple API test script
import requests

resp = requests.get("http://127.0.0.1:5000/")
print(resp.json())
