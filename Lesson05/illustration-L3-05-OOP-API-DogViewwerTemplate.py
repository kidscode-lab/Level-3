import customtkinter as ctk
import requests
from PIL import Image, ImageTk
from io import BytesIO
import threading

class DogImageViewer:
    # CLASS CONSTANTS - Already provided for students
    API_URL = "https://dog.ceo/api/breeds/image/random"
    API_TIMEOUT = 10
    MAX_IMAGE_SIZE = (400, 400)
    
    class UI_CONFIG:
        WINDOW_WIDTH = 600
        WINDOW_HEIGHT = 750
        TITLE = "Random Dog Image Viewer"
        BUTTON_HEIGHT = 40
        MAIN_PADDING = 20
    
    class API_FIELDS:
        STATUS = "status"
        MESSAGE = "message"
        SUCCESS_VALUE = "success"
    
    def __init__(self):
        # UI Setup
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")
        
        self.root = ctk.CTk()
        self.root.title(self.UI_CONFIG.TITLE)
        self.root.geometry(f"{self.UI_CONFIG.WINDOW_WIDTH}x{self.UI_CONFIG.WINDOW_HEIGHT}")
        
        self.current_image = None
        self.setup_ui()
        
        print(f"Using API: {self.API_URL}")
    
    def setup_ui(self):
        """UI Setup - Already completed for students"""
        main_frame = ctk.CTkFrame(self.root)
        main_frame.pack(fill="both", expand=True, 
                       padx=self.UI_CONFIG.MAIN_PADDING, 
                       pady=self.UI_CONFIG.MAIN_PADDING)
        
        title_label = ctk.CTkLabel(
            main_frame, 
            text=self.UI_CONFIG.TITLE, 
            font=ctk.CTkFont(size=24, weight="bold")
        )
        title_label.pack(pady=(20, 30))
        
        # API URL display
        api_label = ctk.CTkLabel(main_frame, text="API Endpoint:", font=ctk.CTkFont(size=14))
        api_label.pack(anchor="w", padx=20, pady=(0, 5))
        
        self.api_textbox = ctk.CTkTextbox(main_frame, height=40, width=500)
        self.api_textbox.pack(fill="x", padx=20, pady=(0, 20))
        self.api_textbox.insert("1.0", self.API_URL)
        self.api_textbox.configure(state="disabled")
        
        # Image URL display
        url_label = ctk.CTkLabel(main_frame, text="Image URL:", font=ctk.CTkFont(size=14))
        url_label.pack(anchor="w", padx=20, pady=(0, 5))
        
        self.url_textbox = ctk.CTkTextbox(main_frame, height=60, width=500)
        self.url_textbox.pack(fill="x", padx=20, pady=(0, 20))
        
        # Fetch button
        self.fetch_button = ctk.CTkButton(
            main_frame,
            text="Get New Dog Image",
            command=self.fetch_dog_image,
            font=ctk.CTkFont(size=16),
            height=self.UI_CONFIG.BUTTON_HEIGHT
        )
        self.fetch_button.pack(pady=(0, 30))
        
        # Status label
        self.status_label = ctk.CTkLabel(
            main_frame, 
            text="Click the button to fetch a random dog image!", 
            font=ctk.CTkFont(size=12)
        )
        self.status_label.pack(pady=(0, 20))
        
        # Image display
        self.image_label = ctk.CTkLabel(main_frame, text="")
        self.image_label.pack(fill="both", expand=True, padx=20, pady=(0, 20))
    
    # =================================================================
    # STUDENT ASSIGNMENT SECTION - IMPLEMENT THE METHODS BELOW
    # =================================================================
    
    def fetch_dog_image(self):
        """
        STUDENT TASK 1: Button Click Handler
        
        This method is called when the user clicks the "Get New Dog Image" button.
        
        TODO:
        1. Update the button to show "Loading..." and disable it
        2. Update the status label to show "Fetching new dog image..."
        3. Start a new thread to call _fetch_image_thread() to prevent UI freezing
        
        HINT: Use threading.Thread(target=self._fetch_image_thread)
        HINT: Set thread.daemon = True and call thread.start()
        """
        
        # TODO: Implement button state changes and threading
        pass
    
    def _fetch_image_thread(self):
        """
        STUDENT TASK 2: API Call and Response Processing
        
        This method runs in a separate thread to make the API call.
        
        TODO:
        1. Make a GET request to self.API_URL with timeout=self.API_TIMEOUT
        2. Parse the JSON response
        3. Check if the API response status is successful
        4. Extract the image URL from the response
        5. Call the appropriate methods to update UI and download image
        6. Handle different types of errors (network errors, JSON errors, etc.)
        
        HINTS:
        - Use requests.get() for the API call
        - Use response.json() to parse JSON
        - Use self.root.after(0, method_name, parameters) to update UI from thread
        - Check self.API_FIELDS constants for field names
        - Call self.update_url_textbox() and self.download_and_display_image()
        - Use try-except blocks for error handling
        """
        
        # TODO: Implement API call and response processing
        pass
    
    def download_and_display_image(self, image_url):
        """
        STUDENT TASK 3: Image Download and Processing
        
        This method downloads the actual image and prepares it for display.
        
        TODO:
        1. Make a GET request to download the image from image_url
        2. Open the image using PIL (Python Imaging Library)
        3. Resize the image to fit within MAX_IMAGE_SIZE
        4. Convert the image to PhotoImage format for tkinter
        5. Call self.display_image() to show it in the UI
        6. Handle errors that might occur during image processing
        
        HINTS:
        - Use requests.get(image_url, timeout=self.API_TIMEOUT)
        - Use Image.open(BytesIO(response.content)) to open image
        - Use image.thumbnail(self.MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
        - Use ImageTk.PhotoImage(image) to convert for tkinter
        - Use self.root.after(0, self.display_image, photo) to update UI
        """
        
        # TODO: Implement image download and processing
        pass
    
    def show_error(self, error_message):
        """
        STUDENT TASK 4: Error Handling Display
        
        This method is called when any error occurs.
        
        TODO:
        1. Update the status label to show the error message
        2. Re-enable the fetch button and reset its text
        3. Clear the image display and show "Failed to load image"
        
        HINTS:
        - Use self.status_label.configure(text=error_message)
        - Use self.fetch_button.configure(state="normal", text="Get New Dog Image")
        - Use self.image_label.configure(image="", text="Failed to load image")
        """
        
        # TODO: Implement error display
        pass
    
    # =================================================================
    # HELPER METHODS - Already implemented for students
    # =================================================================
    
    def update_url_textbox(self, url):
        """Helper method to update the URL textbox - Already implemented"""
        self.url_textbox.delete("1.0", "end")
        self.url_textbox.insert("1.0", url)
    
    def display_image(self, photo):
        """Helper method to display the image - Already implemented"""
        self.current_image = photo
        self.image_label.configure(image=photo, text="")
        self.fetch_button.configure(state="normal", text="Get New Dog Image")
        self.status_label.configure(text="Image loaded successfully!")
    
    def run(self):
        """Start the application - Already implemented"""
        self.root.mainloop()

# =================================================================
# TESTING SECTION FOR STUDENTS
# =================================================================

if __name__ == "__main__":
    print("=== DOG IMAGE VIEWER - STUDENT ASSIGNMENT ===")
    print("Your tasks:")
    print("1. Implement fetch_dog_image() - Handle button click")
    print("2. Implement _fetch_image_thread() - Make API call and process response")
    print("3. Implement download_and_display_image() - Download and show image")
    print("4. Implement show_error() - Handle and display errors")
    print("\nGood luck! 🐕")
    
    app = DogImageViewer()
    app.run()