import requests
import json

def get_location_data(city_name: str):
    # Construct the API URL for the geocoding service
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=en&format=json"

    try:
        # Make the GET request to the Geocoding API
        pass
    except requests.exceptions.RequestException as e:
        print(f"Error fetching location data: {e}")
        return None

def fetch_weather_data(city):

    # Step 1: Get the location data for the desired city
    location = get_location_data(city)
    
    # Step 2: Check if location data was found and then fetch the weather

# --- Main execution ---
if __name__ == "__main__":
    weather_data = fetch_weather_data('Markham')
    if weather_data:
        print(json.dumps(weather_data, indent=4))
