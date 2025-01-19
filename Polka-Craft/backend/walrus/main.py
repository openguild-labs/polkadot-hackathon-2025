from walrus import upload_blob, download_blob, ADDRESS, EPOCHS
import os
import time

random_data = os.urandom(1024 * 1024)

# Upload the blob to the Walrus service
start_time = time.time()
blob_id = upload_blob(ADDRESS, EPOCHS, random_data)
upload_time = time.time()

# Now download the same blob using the blob-id
data = download_blob(ADDRESS, blob_id)
assert data == random_data
download_time = time.time()

# Print some information about the blob
print(f"Blob ID: {blob_id}")
print(f"Wallet ID: {wallet_id}")
print(f"Size {len(random_data)} bytes")
print(f"Upload time: {upload_time - start_time:.2f}s")
print(f"Download time: {download_time - upload_time:.2f}s")
