"""
dog_api.py - Module responsible for interacting with the Dog CEO API.

This module abstracts away the HTTP details of retrieving a random dog
image from the Dog CEO API.  It defines constants for the API
endpoint and timeout, and exposes a single function,
``get_random_dog_image()``, which returns a tuple of
``(image_url, error_message)``.  Only one of these values will be
non-``None``: ``image_url`` will contain a URL string when the API
call is successful, and ``error_message`` will contain a description
of what went wrong when the call fails.

Students in Grade 7/8 can focus on modifying or extending the
``get_random_dog_image()`` function to experiment with API calls,
without needing to delve into the UI details.  The function
illustrates typical patterns in making HTTP requests, handling
exceptions, and interpreting JSON responses.
"""

from __future__ import annotations

import json
from typing import Optional, Tuple

import requests

# API configuration constants.  Adjust these values if you wish to
# experiment with different endpoints or timeouts.
API_URL: str = "https://dog.ceo/api/breeds/image/random"
TIMEOUT: int = 10  # seconds

# Fields expected in the API response.  Keeping these as constants
# makes it easier to update field names if the API ever changes.
STATUS_FIELD: str = "status"
MESSAGE_FIELD: str = "message"
SUCCESS_VALUE: str = "success"


def get_random_dog_image() -> Tuple[Optional[str], Optional[str]]:
    """Fetch a random dog image URL from the Dog CEO API.

    Returns:
        A tuple of (image_url, error_message), where only one will be
        non-None.  If the API call succeeds, ``image_url`` contains
        the URL of the image and ``error_message`` is None.  If an
        error occurs (network error, HTTP error, invalid JSON, or API
        response indicates failure), ``image_url`` will be None and
        ``error_message`` will contain a descriptive string.
    """
    try:
        response = requests.get(API_URL, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        # Handle network and HTTP errors uniformly.  Return the
        # exception message as the error_message.
        return None, f"Network error: {exc}"

    # Parse the JSON response.  Catching ValueError covers cases
    # where response.json() fails due to invalid JSON.
    try:
        data = response.json()
    except ValueError as exc:
        return None, f"Error parsing JSON: {exc}"

    # Validate that the expected fields exist.
    if not isinstance(data, dict):
        return None, "Unexpected response format: not a JSON object"

    status = data.get(STATUS_FIELD)
    message = data.get(MESSAGE_FIELD)

    if status != SUCCESS_VALUE:
        # The API uses "success" for successful calls.  If it's
        # anything else (e.g. "error"), treat it as a failure.
        return None, f"API returned unsuccessful status: {status}"

    if not isinstance(message, str):
        # Ensure the URL is a string before returning it.
        return None, "API response does not contain a valid image URL"

    # At this point, we have a valid URL.
    return message, None


if __name__ == "__main__":
    # Simple test harness.  When run directly, this module will
    # attempt to fetch a random dog image and print the result.
    url, error = get_random_dog_image()
    if error:
        print(f"Error fetching dog image: {error}")
    else:
        print(f"Successfully fetched dog image URL: {url}")