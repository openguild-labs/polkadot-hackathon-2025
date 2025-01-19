import os
import time

# External requests HTTP library
import requests

ADDRESS = "127.0.0.1:31415" 
EPOCHS = "5"


# Helper functions to upload a blob
def upload_blob(ADDRESS, EPOCHS, data):
    # Upload the data to the Walrus service  using a PUT request
    store_url = f"http://{ADDRESS}/v1/store?epochs={EPOCHS}"
    response = requests.put(store_url, data=data)

    # Assert the response status code
    assert response.status_code == 200
    blob_id = response.json()["newlyCreated"]["blobObject"]["blobId"]
    return blob_id


# Helper functions to download a blob
def download_blob(ADDRESS, blob_id):
    # Now read the same resource using the blob-id
    read_url = f"http://{ADDRESS}/v1/{blob_id}"
    response = requests.get(read_url)

    # Assert the response status code
    assert response.status_code == 200
    return response.content