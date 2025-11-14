#!/usr/bin/env bash
set -euo pipefail

MODELS_DIR="$(dirname "$0")/../inference-service/models"
mkdir -p "${MODELS_DIR}/deepsort"

echo "Downloading YOLOv8n weights..."
curl -L -o "${MODELS_DIR}/yolov8n.pt" https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt

echo "Downloading YOLOv8s weights (optional higher accuracy)..."
curl -L -o "${MODELS_DIR}/yolov8s.pt" https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8s.pt

echo "Downloading DeepSORT ReID model..."
curl -L -o "${MODELS_DIR}/deepsort/model.onnx" https://github.com/nwojke/deep_sort/releases/download/v1.0/model.onnx
curl -L -o "${MODELS_DIR}/deepsort/tracker.yaml" https://raw.githubusercontent.com/ZQPei/deep_sort_pytorch/master/configs/deep_sort.yaml

echo "Model assets downloaded to ${MODELS_DIR}"

