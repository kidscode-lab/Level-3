import requests 
import json 

def get_api_data(): 
    try: # Make API request 
        response = requests.get("YOUR API URL") 
        if response.status_code == 200:
            data = response.json() # Process and display data 
            if (data):
                return data
        else: 
            print("API request failed") 
    except Exception as e: 
        print(f"Error: {e}") 

# Main program loop
data = get_api_data()
print(data)