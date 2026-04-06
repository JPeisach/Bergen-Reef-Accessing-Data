# Original source: https://github.com/vrigue/Coral-Reef-Data-Collection/tree/master
# Authors: Vrielle Guevarra, Joshua Peisach
# No license?

# LIBRARIES / DEPENDENCIES
import os
import time
from datetime import datetime
from zoneinfo import ZoneInfo

import requests

# URLs
source_urls = [
    "http://192.168.50.61/cgi-bin/status.xml",
    "http://192.168.50.62/cgi-bin/status.xml",
    "http://192.168.50.63/cgi-bin/status.xml",
    "http://192.168.50.64/cgi-bin/status.xml",
    "http://192.168.50.65/cgi-bin/status.xml",
    "http://192.168.50.66/cgi-bin/status.xml",
    "http://192.168.50.67/cgi-bin/status.xml",
    "http://192.168.50.68/cgi-bin/status.xml",
    "http://192.168.50.80/cgi-bin/status.xml",
]

destination_url = (
    "https://bergen-reef-accessing-data-git-main-jpeisachs-projects.vercel.app/api/xml"
)

DATA_FOLDER = "~/data"

# Ensure the data folder exists
if not os.path.exists(DATA_FOLDER):
    os.makedirs(DATA_FOLDER)

time.sleep(3)


# Download the XML from the source URL and save it
def download_xml():
    for source_url in source_urls:
        try:
            print(f"Fetching text from {source_url}...")
            response = requests.get(source_url)

            # Check if the request was successful
            if response.status_code == 200:
                print("Download successful!")

                # Save data with a timestamp
                timestamp = int(time.time())  # Create unique filename
                file_path = os.path.join(DATA_FOLDER, f"data_{timestamp}.xml")

                with open(file_path, "w") as f:
                    f.write(response.text)  # The content of the XML

                print(f"Saved XML to {file_path}")
                continue

            else:
                print(f"Failed to download XML: {response.status_code}")

        except Exception as e:
            print(f"Error fetching XML: {e}")


# Upload XML files, ensuring all stored files get sent in case of an outage
def upload_pending_files():
    files = sorted(os.listdir(DATA_FOLDER))  # Sort to upload oldest first

    for file_name in files:
        file_path = os.path.join(DATA_FOLDER, file_name)

        with open(file_path, "r") as f:
            data = f.read()

        backoff = 10

        while True:
            try:
                print(f"Uploading {file_name} to {destination_url}...")
                headers = {"Content-Type": "application/xml"}
                response = requests.post(destination_url, headers=headers, data=data)

                # Check if the request was successful
                if response.status_code == 200:
                    print(f"Upload successful: {file_name}")
                    os.remove(file_path)  # Delete file after successful upload
                    break  # Move to the next file
                else:
                    print(f"Upload failed. Status code: {response.status_code}")

            except Exception as e:
                print(f"Error uploading {file_name}: {e}")

            # Wait before retrying
            print(f"Retrying upload of {file_name} in {backoff} seconds...")
            time.sleep(backoff)
            backoff = min(backoff * 2)  # Exponential backoff


# MAIN LOOP
while True:
    current_time = datetime.now(ZoneInfo("America/New_York"))
    print(current_time.strftime("%Y-%m-%d %H:%M:%S"))

    # First, try uploading any stored data files BEFORE downloading new data
    upload_pending_files()

    # Download most recent data and store it
    download_xml()

    # Upload the most recent and downloaded data, which is now stored
    upload_pending_files()

    print("Sleeping for an hour...")
    time.sleep(3600)
