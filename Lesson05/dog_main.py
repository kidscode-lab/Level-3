"""
main.py - Application entry point for the Random Dog Image Viewer

This script brings together the user interface and API modules.  
When executed, it creates an instance of ``DogImageViewerUI`` from
dog_ui.py and starts the Tkinter event loop.  
Keeping the entry point separate makes it easy to run the program, 
and allows for unit testing of the UI and API modules independently.
"""

from __future__ import annotations

from dog_api_ui import DogImageViewerUI

def main() -> None:
    """Initialise and run the dog image viewer application."""
    viewer = DogImageViewerUI()
    viewer.run()

if __name__ == "__main__":
    main()