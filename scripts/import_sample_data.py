#!/usr/bin/env python3
"""
Utility script to load sample analytics data into MongoDB for development testing.
"""
import argparse
import datetime as dt
from uuid import uuid4

from pymongo import MongoClient


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed MongoDB with sample vehicle analytics data.")
    parser.add_argument("--mongo-uri", default="mongodb://localhost:27017/vdt", help="MongoDB connection URI.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    client = MongoClient(args.mongo_uri)
    db = client.get_default_database()

    video_id = str(uuid4())
    db.videos.insert_one(
        {
            "_id": video_id,
            "title": "Sample Intersection Feed",
            "userId": "demo-user",
            "sourceUrl": "samples/intersection.mp4",
            "storagePath": "samples/intersection.mp4",
            "uploadedAt": dt.datetime.utcnow(),
            "duration": 120.0,
            "fpsTarget": 30,
            "status": "COMPLETED",
        }
    )
    db.metrics.insert_one(
        {
            "videoId": video_id,
            "map50": 0.78,
            "precision": 0.85,
            "recall": 0.73,
            "avgFps": 27.5,
            "avgLatencyMs": 32.4,
            "totalVehicles": 342,
            "lastEvaluatedAt": dt.datetime.utcnow(),
        }
    )
    print(f"Seeded sample data for video {video_id}")


if __name__ == "__main__":
    main()

