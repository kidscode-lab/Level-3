"""
dog_api_template.py - Skeleton for the Dog CEO API interaction

This file provides a starting point for students to implement the
functionality required to fetch a random dog image from the Dog CEO
API.  The goal of this template is to encourage students to apply
their understanding of making HTTP requests, handling errors, parsing
JSON, and returning results in a structured way.

Students should complete the ``get_random_dog_image()`` function by
following the comments within it.  The function should:
- return a tuple ``(image_url, error_message)`` 
  where only one of the values is non-``None``.  
If the API call succeeds and returns a URL, set
``error_message`` to ``None``; 
otherwise, set ``image_url`` to ``None`` 
  and ``error_message`` to a descriptive message.

Constants are provided for the API endpoint and timeout.  These can
be adjusted to experiment with different API behaviours.
"""

from __future__ import annotations

from typing import Optional, Tuple

import requests

# Base URL for the Dog CEO random image API.  Feel free to change
# this value if you wish to experiment with other endpoints.
API_URL: str = "https://dog.ceo/api/breeds/image/random"

# Timeout for the HTTP request (in seconds).  This prevents the
# program from hanging indefinitely if the server does not respond.
TIMEOUT: int = 10

# Expected JSON field names in the API response.  Keeping these
# constants separate makes them easier to update if the API changes.
STATUS_FIELD: str = "status"
MESSAGE_FIELD: str = "message"
SUCCESS_VALUE: str = "success"

def get_random_dog_image() -> Tuple[Optional[str], Optional[str]]:
   """
      Fetch a random dog image URL from the Dog CEO API.

      1. Make an HTTP GET request to API_URL using requests.get.
         - Remember to specify timeout=TIMEOUT in your call.
         - (example: request.get(API_URL, timeout=TIMEOUT))
         - After receiving a response, call raise_for_status()
         - Use a try/except block to catch network-related exceptions
         - from the requests library 
         - (example: requests.exceptions.RequestException).
   """
   # Write your code below:

   """
      2. Parse the response body as JSON using response.json().  
         - If parsing fails, catch the resulting exception and return an
         error message.
   """
   # Write your code below:

   
   """
      3. The JSON data should be a dictionary {} with at least two fields:
         {STATUS_FIELD, MESSAGE_FIELD}.
         (example: data.get(STATUS_FIELD))
         - Verify that the status field equals SUCCESS_VALUE (string of "success").  
         - If it does not, return an error message indicating that 
           the API did not succeed.
   """
   # Your code here:

   
   """
      4. If the API returned a success status, the message field will
         contain the URL of the dog image.  
         - Ensure that this value is a string; 
           (example: isinstance(message, str))
         - if so, return it as image_url with error_message set to None.
           (example: return message, None)
   """
   # Your code here:

   # return image_url, error_message
   return None, "Function not yet implemented."