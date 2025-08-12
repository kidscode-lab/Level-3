import requests

URL = "https://dog.ceo/api/breeds/image/random"

try:
    response = requests.get(URL, timeout=10)
    response.raise_for_status()
except requests.exceptions.HTTPError as e:
    print("Status Code:", response.status_code)

data = response.json()

print(data["status"])
print(data["message"])

