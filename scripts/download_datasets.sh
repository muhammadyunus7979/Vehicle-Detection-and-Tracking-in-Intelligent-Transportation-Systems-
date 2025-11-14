#!/usr/bin/env bash
set -euo pipefail

DATA_DIR="$(dirname "$0")/../data"
mkdir -p "${DATA_DIR}"

echo "Downloading UA-DETRAC sample..."
curl -L -o "${DATA_DIR}/ua-detrac-sample.zip" https://github.com/ITS-datasets/ua-detrac/releases/download/v1.0/sample.zip

echo "Downloading KITTI tracking sample..."
curl -L -o "${DATA_DIR}/kitti-tracking-sample.zip" https://s3.eu-central-1.amazonaws.com/avg-kitti/data_tracking_image_2.zip

echo "Datasets downloaded to ${DATA_DIR}. Unzip manually or via 'unzip *.zip'."

