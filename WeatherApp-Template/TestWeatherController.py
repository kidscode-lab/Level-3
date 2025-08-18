from WeatherController import Weather

weather = Weather("Markham")
  
if weather.fetch():
    # Print the results to visually inspect them
    print("\n--- Testing Processed Data ---")
    
    today = weather.current_weather
    print("\nVERIFYING: Today's Weather")
    print(f"  > Temperature: {today['temperature']}°C")
    print(f"  > Feels Like: {today['feels_like']}°C")
    print(f"  > Humidity: {today['humidity']}%")
    print(f"  > Sunrise: {today['sunrise']}") # Should be like '06:30am'

    print("\nVERIFYING: Daily Forecast")
    print(f"  > Found {len(weather.daily_forecast)} days of forecast.") # Should be 6
    for day in weather.daily_forecast:
        print(f"  > {day['day_of_week']}: {day['temp_min']}°C - {day['temp_max']}°C") # Should be like 'Tue'

print("\n--- TEST COMPLETE ---")