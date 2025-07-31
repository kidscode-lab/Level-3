"""
dog_ui.py - User Interface module for the Random Dog Image Viewer

The UI module defines a single class, DogImageViewerUI, 
which builds the window, manages user interactions, and delegates API calls to an external module dog_api.  
To replace or extend the API behaviour, simply swap out the imported module at the top of this file.

The UI reacts to button presses by launching background threads that invoke the API module.  
When the API returns a URL for an image, dog_ui.py handles downloading the image and updating the display.

Students working on the API can ignore this file entirely; 
they should only need to implement the functions exposed by the API module.
"""

import threading
from io import BytesIO
from typing import Optional

import customtkinter as ctk
from PIL import Image, ImageTk
import requests

# Import the API module.  
# This module is expected to provide a get_random_dog_image() function 
#   that returns a tuple of (image_url: Optional[str], error_message: Optional[str]).
# If error_message is not None, it should describe what went wrong.
try:
    import dog_api  # type: ignore
    
except ImportError:
    # If the API module is not found, create a dummy implementation to prevent runtime errors.
    # This fallback will return an error indicating that the API is unavailable.
    # Students should supply their own implementation in a separate file (e.g. dog_api_template.py).
    class _DummyAPI:
        def get_random_dog_image(self) -> tuple[Optional[str], Optional[str]]:
            return None, "API module not available."

    dog_api = _DummyAPI()


class DogImageViewerUI:
    """User interface for displaying random dog images.

    This class encapsulates the window layout, user interactions,
    threading for non-blocking API calls, and image display logic.  
    It relies on an external API module (``dog_api``) to fetch image URLs.  
    When the API returns a URL, ``DogImageViewerUI`` handles
    downloading and displaying the image.
    """

    # Class-level constants controlling window appearance and API
    # behaviour.  Adjust these values to change the UI without
    # modifying logic.
    WINDOW_WIDTH: int = 600
    WINDOW_HEIGHT: int = 750
    BUTTON_HEIGHT: int = 40
    MAIN_PADDING: int = 20
    API_TIMEOUT: int = 10
    MAX_IMAGE_SIZE: tuple[int, int] = (400, 400)
    TITLE: str = "Random Dog Image Viewer"

    def __init__(self) -> None:
        """Initialise the window and set up widgets."""
        # Configure customtkinter appearance for a consistent look.
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        # Create the main window.
        self.root = ctk.CTk()
        self.root.title(self.TITLE)
        self.root.geometry(f"{self.WINDOW_WIDTH}x{self.WINDOW_HEIGHT}")

        # Initialise variables to hold the current image reference.  
        # This attribute prevents the Python garbage collector from cleaning up images prematurely.
        self._current_image: Optional[ImageTk.PhotoImage] = None

        # Build out the UI components.
        self._setup_ui()

    def _setup_ui(self) -> None:
        """Create and arrange widgets within the main window."""
        # Main frame with padding to ensure content isn't flush with window borders.
        main_frame = ctk.CTkFrame(self.root)
        main_frame.pack(
            fill="both",
            expand=True,
            padx=self.MAIN_PADDING,
            pady=self.MAIN_PADDING,
        )

        # Title label at the top.
        title_label = ctk.CTkLabel(
            main_frame,
            text=self.TITLE,
            font=ctk.CTkFont(size=24, weight="bold"),
        )
        title_label.pack(pady=(20, 30))

        # Placeholder for API endpoint label.  
        # This is static, but present to illustrate where the API endpoint would be shown.
        api_label = ctk.CTkLabel(
            main_frame,
            text="API Endpoint:",
            font=ctk.CTkFont(size=14),
        )
        api_label.pack(anchor="w", padx=20, pady=(0, 5))

        # Endpoint textbox.  
        # Students generally should not need to modify this during class exercises.  
        # Keep it open for demonstrate how changing endpoints affects behaviour
        self.api_textbox = ctk.CTkTextbox(main_frame, height=40, width=500)
        self.api_textbox.pack(fill="x", padx=20, pady=(0, 20))
        try:
            # Attempt to show the API URL from the imported module.  
            # If unavailable, leave the textbox blank.
            self.api_textbox.insert("1.0", getattr(dog_api, "API_URL", ""))
        except Exception:
            pass
        self.api_textbox.configure(state="disabled")

        # Image URL section label and textbox.  
        # This will show the URL returned by the API.
        url_label = ctk.CTkLabel(
            main_frame,
            text="Image URL:",
            font=ctk.CTkFont(size=14),
        )
        url_label.pack(anchor="w", padx=20, pady=(0, 5))

        self.url_textbox = ctk.CTkTextbox(main_frame, height=60, width=500)
        self.url_textbox.pack(fill="x", padx=20, pady=(0, 20))

        # Button to trigger fetching a new image.
        self.fetch_button = ctk.CTkButton(
            main_frame,
            text="Get New Dog Image",
            command=self._on_fetch_button_click,
            font=ctk.CTkFont(size=16),
            height=self.BUTTON_HEIGHT,
        )
        self.fetch_button.pack(pady=(0, 30))

        # Status label to communicate progress and errors.
        self.status_label = ctk.CTkLabel(
            main_frame,
            text="Click the button to fetch a random dog image!",
            font=ctk.CTkFont(size=12),
        )
        self.status_label.pack(pady=(0, 20))

        # Image display area.  An empty label will hold the PhotoImage once loaded.
        self.image_label = ctk.CTkLabel(main_frame, text="")
        self.image_label.pack(fill="both", expand=True, padx=20, pady=(0, 20))

    def _on_fetch_button_click(self) -> None:
        """Handle the button press by starting a background thread."""
        # Disable the button to prevent multiple concurrent requests and update the status label.
        self.fetch_button.configure(state="disabled", text="Loading...")
        self.status_label.configure(text="Fetching new dog image...")

        # Launch a new thread to call the API without blocking the UI.
        thread = threading.Thread(target=self._fetch_image_thread)
        thread.daemon = True
        thread.start()

    def _fetch_image_thread(self) -> None:
        """Worker thread to call the API and handle results."""
        # Ask the API module for a random dog image.  The API should
        # return a tuple: (image_url, error_message).  Only one of
        # these values will be non-None.
        try:
            image_url, error_message = dog_api.get_random_dog_image()
        except Exception as exc:
            # Unexpected exceptions are caught here.  
            # Pass the error up to the UI thread for display.
            error_message = f"Unexpected error: {exc}"
            image_url = None

        # Decide what to do based on the API result.
        if error_message:
            # Inform the main thread to display the error.
            self.root.after(0, self._show_error, error_message)
        elif image_url:
            # Update the URL textbox and download the image.  
            # Note: we update the textbox in the main thread for thread-safety.
            self.root.after(0, self._update_url_textbox, image_url)
            self._download_and_display_image(image_url)
        else:
            # Fallback in case both values are None.
            self.root.after(0, self._show_error, "No image URL returned by API.")

    def _update_url_textbox(self, url: str) -> None:
        """Replace the contents of the URL textbox with a new value."""
        self.url_textbox.configure(state="normal")
        self.url_textbox.delete("1.0", "end")
        self.url_textbox.insert("1.0", url)
        self.url_textbox.configure(state="disabled")

    def _download_and_display_image(self, image_url: str) -> None:
        """Fetch the image data and update the display.

        This method runs in the worker thread because downloading
        network resources can be slow.  UI updates are marshalled back
        onto the main thread using ``root.after``.
        """
        try:
            response = requests.get(image_url, timeout=self.API_TIMEOUT)
            response.raise_for_status()

            # Decode image data.
            image = Image.open(BytesIO(response.content))
            image.thumbnail(self.MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
            photo = ImageTk.PhotoImage(image)

            # Pass the PhotoImage to the main thread for display.
            self.root.after(0, self._display_image, photo)
        except Exception as exc:
            # If anything goes wrong, inform the user.
            self.root.after(0, self._show_error, f"Error loading image: {exc}")

    def _display_image(self, photo: ImageTk.PhotoImage) -> None:
        """Update the image label and reset the button and status."""
        # Store a reference to the image to prevent it being garbage collected.
        self._current_image = photo
        self.image_label.configure(image=photo, text="")
        self.fetch_button.configure(state="normal", text="Get New Dog Image")
        self.status_label.configure(text="Image loaded successfully!")

    def _show_error(self, message: str) -> None:
        """Display an error message and reset the button."""
        self.status_label.configure(text=message)
        self.fetch_button.configure(state="normal", text="Get New Dog Image")
        # Clear any existing image from the label.
        self.image_label.configure(image="", text="Failed to load image")

    def run(self) -> None:
        """Enter the Tkinter main loop to start the application."""
        self.root.mainloop()


if __name__ == "__main__":
    app = DogImageViewerUI()
    app.run()