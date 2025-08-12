import customtkinter as ctk
from PIL import Image # Pillow library for handling images
import os

# Import the backend classes we created
from WeatherController import Weather

# --- Main Application Class ---
class WeatherApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # --- Basic Window Configuration ---
        self.title("Weather App")
        self.geometry("650x550")
        self.minsize(650, 550)
        
        # --- state variables ---
        self.weather_controller = None
        self.forecast_start_index = 0

        # --- Configure Grid Layout ---
        # The app window will have 3 rows and 1 column
        self.grid_rowconfigure(0, weight=0) # Top frame for city input
        self.grid_rowconfigure(1, weight=0) # Middle frame for forecast tiles
        self.grid_rowconfigure(2, weight=1) # Bottom frame for today's details (expands)
        self.grid_columnconfigure(0, weight=1)

        # --- Initialize UI Components ---
        self.create_top_frame()
        self.create_forecast_frame()
        self.create_today_frame()
        
        # --- Load initial data for a default city ---
        self.refresh_weather_data("Markham")

    def create_top_frame(self):
        """Creates the top frame containing the city entry and refresh button."""
        top_frame = ctk.CTkFrame(self, corner_radius=10)
        top_frame.grid(row=0, column=0, padx=10, pady=10, sticky="ew")
        top_frame.grid_columnconfigure(0, weight=1)

        self.city_entry = ctk.CTkEntry(top_frame, placeholder_text="Enter City Name")
        self.city_entry.grid(row=0, column=0, padx=10, pady=10, sticky="ew")

        refresh_button = ctk.CTkButton(top_frame, text="Refresh", command=self.on_refresh)
        refresh_button.grid(row=0, column=1, padx=10, pady=10)

    def create_forecast_frame(self):
        """Creates the frame that holds the 6-day forecast tiles."""
        forecast_frame = ctk.CTkFrame(self)
        forecast_frame.grid(row=1, column=0, padx=10, pady=0, sticky="ew")
        # Create 8 columns for arrows and 6 forecast tiles
        forecast_frame.grid_columnconfigure(list(range(8)), weight=1)

        # Arrow buttons (placeholders for now)
        self.left_arrow = ctk.CTkButton(forecast_frame, text="<", width=30, command=self.scroll_forecast_backward)
        self.left_arrow.grid(row=0, column=0, padx=5, pady=10)
        
        self.right_arrow = ctk.CTkButton(forecast_frame, text=">", width=30, command=self.scroll_forecast_forward)
        self.right_arrow.grid(row=0, column=7, padx=5, pady=10)

        # Create a list to hold references to the forecast tile widgets
        self.forecast_tiles = []
        for i in range(6):
            tile = ctk.CTkFrame(forecast_frame, corner_radius=10)
            tile.grid(row=0, column=i+1, padx=5, pady=5, sticky="nsew")
            
            # Add labels to the tile that we can update later
            day_label = ctk.CTkLabel(tile, text="Day", font=("Helvetica", 14, "bold"))
            day_label.pack(pady=(5,0))
            
            # Weather Icon (placeholder text for now)
            icon_label = ctk.CTkLabel(tile, text="☀️", font=("Helvetica", 24))
            icon_label.pack(padx=(30, 0), pady=(5,0))

            temp_label = ctk.CTkLabel(tile, text="0° - 0°")
            temp_label.pack(pady=(0,5))
            
            # Store the labels so we can update them
            self.forecast_tiles.append({'day': day_label, 'icon': icon_label, 'temp': temp_label})

    def create_today_frame(self):
        """Creates the main frame for today's detailed weather information using a refined 3x5 grid."""
        today_frame = ctk.CTkFrame(self, corner_radius=10)
        today_frame.grid(row=2, column=0, padx=10, pady=10, sticky="nsew")
        
        # --- Configure the 3x5 grid ---
        today_frame.grid_columnconfigure((0, 1, 2), weight=1)
        today_frame.grid_rowconfigure(list(range(5)), weight=1)

        # --- Definelarge_font Font Styles ---
        extra_large_font = ("Helvetica", 32, "bold") # Font for City and Temperature
        large_font = ("Helvetica", 22, "bold")
        icon_font = ("Helvetica", 48)          # Font for the weather icon
        medium_font = ("Helvetica", 16)        # Font for Feels Like and Humidity
        default_font = ("Helvetica", 14)       # Default font for other items

        # --- Create and Place All Labels in the New Layout ---

        # Row 0: City Name (left), day (middle) and Temperature (right)
        self.day_label = ctk.CTkLabel(today_frame, text="Day", font=large_font, justify="left")
        self.day_label.grid(row=0, column=0, sticky="w", padx=20, pady=10)

        self.city_name_label = ctk.CTkLabel(today_frame, text="City Name", font=extra_large_font, justify="center")
        self.city_name_label.grid(row=0, column=1, sticky="we", padx=5, pady=5)

        self.today_icon_label = ctk.CTkLabel(today_frame, text="", font=icon_font, justify="right")
        self.today_icon_label.grid(row=0, column=2, sticky="e", padx=20)

        # Row 1: Temp
        self.today_temp_label = ctk.CTkLabel(today_frame, text="--°C", font=extra_large_font, justify="center")
        self.today_temp_label.grid(row=1, column=2, sticky="we", padx=(0, 20), pady=5)

        # Row 2: UV, Precipitation, Feels Like
        self.uv_index_label = ctk.CTkLabel(today_frame, text="UV Index: --", font=default_font)
        self.uv_index_label.grid(row=2, column=0, sticky="w", padx=20)

        self.precip_label = ctk.CTkLabel(today_frame, text="Max Precip: --%", font=default_font)
        self.precip_label.grid(row=2, column=1, sticky="w", padx=10)

        self.feels_like_label = ctk.CTkLabel(today_frame, text="Feels like: --°", font=medium_font)
        self.feels_like_label.grid(row=2, column=2, sticky="w", padx=20)

        # Row 3: Wind, Humidity
        self.wind_label = ctk.CTkLabel(today_frame, text="Wind: -- km/h", font=default_font)
        self.wind_label.grid(row=3, column=0, sticky="w", padx=20)

        self.humidity_label = ctk.CTkLabel(today_frame, text="Humidity: --%", font=medium_font)
        self.humidity_label.grid(row=3, column=2, sticky="w", padx=20)

        # Row 4: Sunrise, Sunset
        self.sunrise_label = ctk.CTkLabel(today_frame, text="Sunrise: --:--", font=default_font)
        self.sunrise_label.grid(row=4, column=0, sticky="w", padx=20, pady=(0, 10))

        self.sunset_label = ctk.CTkLabel(today_frame, text="Sunset: --:--", font=default_font)
        self.sunset_label.grid(row=4, column=1, sticky="w", padx=10, pady=(0, 10))
    
        # # Create a 2-pixel wide frame to act as a line
        # vertical_line_1 = ctk.CTkFrame(today_frame, width=2, corner_radius=0)
        # # Place it between column 0 and 1, and make it span rows 2, 3, and 4
        # vertical_line_1.grid(row=2, column=0, rowspan=3, sticky="ne", padx=(0,5))

        # vertical_line_2 = ctk.CTkFrame(today_frame, width=2, corner_radius=0)
        # # Place it between column 1 and 2
        # vertical_line_2.grid(row=2, column=1, rowspan=3, sticky="ne", padx=(0,5))
        
        # # --- Add a Horizontal Separator Line ---
        # # Create a 2-pixel high frame to act as a line
        # horizontal_line = ctk.CTkFrame(today_frame, height=2, corner_radius=0)
        # # Place it in row 3, spanning all 3 columns
        # horizontal_line.grid(row=3, column=0, columnspan=3, sticky="sew", pady=5)

    def on_refresh(self):
        """Called when the Refresh button is clicked."""
        city = self.city_entry.get()
        if city:
            self.refresh_weather_data(city)
        else:
            print("Please enter a city name.")
            self.city_name_label.configure(text="Please enter a city!")

    def refresh_weather_data(self, city: str):
        """The core logic to fetch and display weather data."""
        print(f"GUI: Attempting to fetch data for {city}...")
        
        self.weather_controller = Weather(city)
        self.forecast_start_index = 0 # Reset scroll on new search

        # --- THIS IS THE CORRECTED LOGIC ---
        if self.weather_controller.fetch():
            # If fetch() returns True, it means we have data. Now update the UI.
            print("GUI: Fetch successful. Updating UI.")
            self.update_ui(self.weather_controller)
        else:
            # If fetch() returns False, the city was not found or an error occurred.
            print("GUI: Fetch failed. Displaying error message.")
            self.city_name_label.configure(text=f"City '{city}' not found")
            # Clear the other fields here if any
            self.today_temp_label.configure(text="--°C")
            self.today_icon_label.configure(text="")


    def update_ui(self, weather: Weather):
        """Populates all the GUI widgets with data from the Weather object."""
        self.update_today_tile(weather)
        self.update_forecast_tiles()

    def get_icon_for_code(self, code: int) -> str:
        """Translates a WMO weather code to a display emoji."""
        if code == 0: return "☀️"
        elif code in [1, 2, 3]: return "☁️"
        elif code in [45, 48]: return "🌫️"
        elif code in [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]: return "🌧️"
        elif code in [71, 73, 75, 77, 85, 86]: return "❄️"
        elif code in [95, 96, 99]: return "⛈️"
        else: return "❓"

    def update_today_tile(self, weather: Weather):
        """Updates only the widgets in the 'Today's Weather' tile."""
        today = weather.current_weather
        if not today: return

        self.city_name_label.configure(text=weather.city.title())
        self.day_label.configure(text=today["day_of_week"])
        self.today_temp_label.configure(text=f"{today['temperature']}°C")
        self.today_icon_label.configure(text=self.get_icon_for_code(today['weather_code']))
        self.uv_index_label.configure(text=f"UV Index: {today['uv_index']}")
        self.precip_label.configure(text=f"Max Precip: {today['precipitation_chance']}%")
        self.feels_like_label.configure(text=f"Feels like: {today['feels_like']}°")
        self.wind_label.configure(text=f"Wind: {today['wind_speed']}km/h")
        self.humidity_label.configure(text=f"Humidity: {today['humidity']}%")
        self.sunrise_label.configure(text=f"Sunrise: {today['sunrise']}")
        self.sunset_label.configure(text=f"Sunset: {today['sunset']}")

    def update_forecast_tiles(self):
        """Updates the 6 forecast tiles based on the current start index."""
        if not self.weather_controller or not self.weather_controller.daily_forecast:
            return

        full_forecast = self.weather_controller.daily_forecast
        
        # Get the 6-day slice of the forecast to display
        display_forecast = full_forecast[self.forecast_start_index : self.forecast_start_index + 6]
        for i, day_data in enumerate(display_forecast):
            if i < len(self.forecast_tiles):
                tile = self.forecast_tiles[i]
                tile['day'].configure(text=day_data['day_of_week'])
                tile['icon'].configure(text=self.get_icon_for_code(day_data['weather_code']), justify="right")
                tile['temp'].configure(text=f"{day_data['temp_min']}° - {day_data['temp_max']}°")
        
        # --- Manage Button State ---
        # Disable left arrow if we are at the beginning
        if self.forecast_start_index == 0:
            self.left_arrow.configure(state="disabled")
        else:
            self.left_arrow.configure(state="normal")

        # Disable right arrow if there are no more days to show
        if self.forecast_start_index + 6 >= len(full_forecast):
            self.right_arrow.configure(state="disabled")
        else:
            self.right_arrow.configure(state="normal")

    # --- 6 days forecast scrolling ---
    def scroll_forecast_forward(self):
        """Move the forecast view one day forward."""
        self.forecast_start_index += 1
        self.update_forecast_tiles()

    def scroll_forecast_backward(self):
        """Move the forecast view one day backward."""
        self.forecast_start_index -= 1
        self.update_forecast_tiles()

# --- Main execution ---
if __name__ == "__main__":
    app = WeatherApp()
    app.mainloop()