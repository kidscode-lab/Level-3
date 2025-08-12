from WeatherController import Weather

weather = Weather("Markham")
  
if weather.fetch():
    # Print the results to visually inspect them
    print("\n--- Testing Processed Data ---")


print("\n--- TEST COMPLETE ---")