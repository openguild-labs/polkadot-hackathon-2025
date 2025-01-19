#!/bin/bash

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed. Please install curl to run this script."
    exit 1
fi

# Check if xxd is installed
if ! command -v xxd &> /dev/null; then
    echo "Error: xxd is not installed. Please install xxd to run this script."
    exit 1
fi

# Set default values
OUTPUT_DIR="tests/data"
HEIGHTS=(854784 856799 856800 856801 854376 852768 854373 854374 854375 854377 854378 854379 854380 854136 858564 858565 858566 858567 858568)
API_URL="https://blockstream.info/api"

# Function to display usage
usage() {
    echo "Usage: $0 [-h <height1,height2,...>] [-d <output_directory>] [-a <api_url>]"
    echo "  -h: Comma-separated list of block heights (optional, default: 852768,854374,854136,858564,856800,858565,858566,858567,858568)"
    echo "  -d: Output directory (optional, default: tests/data)"
    echo "  -a: API URL (optional, default: https://blockstream.info/api)"
    exit 1
}

# Parse command line arguments
while getopts "h:d:a:" opt; do
    case $opt in
        h) IFS=',' read -ra HEIGHTS <<< "$OPTARG" ;;
        d) OUTPUT_DIR=$OPTARG ;;
        a) API_URL=$OPTARG ;;
        *) usage ;;
    esac
done

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Download blocks
for height in "${HEIGHTS[@]}"; do
    echo "Downloading block at height $height..."
    
    # Get block hash
    block_hash=$(curl -s "$API_URL/block-height/$height")
    
    if [ -z "$block_hash" ] || [ "$block_hash" == "null" ]; then
        echo "Error: Could not retrieve block hash for height $height"
        continue
    fi
    
    # Download raw block data
    temp_file=$(mktemp)
    if curl -s "$API_URL/block/$block_hash/raw" --output "$temp_file"; then
        # Convert to hex, ensure even length, and remove unexpected '.0' at the end
        xxd -p -c 0 < "$temp_file" | tr -d '\n' | sed 's/\.0$//' > "$OUTPUT_DIR/block_$height.hex"
        
        echo "Block $height saved successfully."
    else
        echo "Error: Could not download raw block for hash $block_hash"
    fi
    
    rm "$temp_file"
    
    # Add a small delay to avoid rate limiting
    sleep 3
done

echo "Download completed. Blocks saved in $OUTPUT_DIR"
