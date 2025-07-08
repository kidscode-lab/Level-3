# L3 - Lesson 03
#   Simple API call

import requests
import json

# Quick API test function
def test_api(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if(data):
                return data
        else:
            print(f"Error: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

# Execute API call and iterate returned value
jsonData = test_api("http://numbersapi.com/42?json")

if (jsonData):
    for key, value in jsonData.items():
        print(f'Key: {key} - Value: {value}')