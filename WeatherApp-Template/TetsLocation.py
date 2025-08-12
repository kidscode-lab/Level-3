import requests
import json

def get_locatoin_data(city_name: str):
    # Construct the API URL for the geocoding service
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=en&format=json"


print(get_locatoin_data("Markham"))
