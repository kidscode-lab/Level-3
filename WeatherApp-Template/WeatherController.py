from datetime import datetime
from WeatherAPI import fetch_weather_data

class Weather:
    """
    Parses the raw weather API data and organizes it into a structured format
    that is easy for the application (e.g., the GUI) to use.
    """
    def __init__(self, city: str):
        # --- Process the data immediately ---
        self.city = city
        self.current_weather = None
        self.daily_forecast = None

    def fetch(self) -> bool:
        # develop this function to fetch weather data from API
        pass
        
    def _process_current_weather(self, data: dict) -> dict:

        current = data.get("current_weather", {})
        daily = data.get("daily", {})

        weather_code = daily.get("weathercode", [0])[0]

        return {
            "day_of_week": self._get_day_of_week(daily["time"][0]),
            "temperature": round(current.get("temperature", 0)),
            "feels_like": round(daily.get("apparent_temperature_max", [0])[0]),
            "humidity": round(daily.get("relative_humidity_2m_mean", [0])[0]),
            "wind_speed": round(current.get("windspeed", 0)),
            "uv_index": daily.get("uv_index_max", [0])[0],
            "sunrise": self._format_time(daily.get("sunrise", [""])[0]),
            "sunset": self._format_time(daily.get("sunset", [""])[0]),
            "precipitation_chance": daily.get("precipitation_probability_max", [0])[0], # Renamed key
            "weather_code": weather_code,
            "description": self._get_weather_description(weather_code)
        }

    def _process_daily_forecast(self, data: dict) -> list:

        forecast_list = []
        daily_data = data.get("daily", {})

        if not daily_data or 'time' not in daily_data:
            return forecast_list

        for i in range(1, len(daily_data["time"])):
            try:
                code = daily_data["weathercode"][i]
                day_data = {
                    "day_of_week": self._get_day_of_week(daily_data["time"][i]),
                    "temp_min": round(daily_data["temperature_2m_min"][i]),
                    "temp_max": round(daily_data["temperature_2m_max"][i]),
                    "weather_code": code,
                    "description": self._get_weather_description(code)
                }
                forecast_list.append(day_data)
            except IndexError:
                break
                
        return forecast_list

    def _get_weather_description(self, code: int) -> str:
        """Translates a WMO weather code into a human-readable string."""
        if code == 0: return "Sunny"
        elif code in [1, 2, 3]: return "Partly Cloudy"
        elif code in [45, 48]: return "Foggy"
        elif code in [51, 53, 55, 56, 57]: return "Drizzling"
        elif code in [61, 63, 65, 66, 67]: return "Rainy"
        elif code in [71, 73, 75, 77]: return "Snowy"
        elif code in [80, 81, 82]: return "Rain Showers"
        elif code in [85, 86]: return "Snow Showers"
        elif code in [95, 96, 99]: return "Thunderstorm"
        else: return "Unknown"

    def _format_time(self, iso_string: str) -> str:
        """Converts an ISO 8601 time string (e.g., '2025-08-11T06:18') to '06:18am'."""
        if not iso_string:
            return ""
        try:
            # Parse the full ISO string
            dt_object = datetime.fromisoformat(iso_string)
            # Format it to 12-hour time with am/pm
            return dt_object.strftime("%I:%M%p").lower()
        except ValueError:
            return ""

    def _get_day_of_week(self, date_string: str) -> str:
        """Converts a date string (e.g., '2025-08-11') to a three-letter day (e.g., 'Mon')."""
        try:
            # Parse the date string
            date_object = datetime.strptime(date_string, "%Y-%m-%d")
            # Format it to a short day name
            return date_object.strftime("%a")
        except ValueError:
            return ""
