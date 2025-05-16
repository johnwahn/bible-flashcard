
from pymongo.mongo_client import MongoClient
import os
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# Read the Mongo URI from the .env file
MONGO_URI = os.getenv("MONGO_URI")

# Create a new client and connect to the server
client = MongoClient(MONGO_URI)
db = client["bible"]
collection = db["verses"]

# Load and insert the JSON data
with open("kor_bible.json", encoding="utf-8") as f:
    data = json.load(f)

collection.delete_many({})  # Clear old data
documents = [{'_id': ref, 'text': verse} for ref, verse in data.items()]
collection.insert_many(documents)

print("✅ Verses inserted successfully!")