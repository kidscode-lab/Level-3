import json
from WeatherAPI import fetch_weather_data

weather_data = fetch_weather_data('Markham')

if weather_data:
    print(json.dumps(weather_data, indent=4))