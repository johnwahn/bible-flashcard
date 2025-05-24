from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client["bible"]

def get_db_collection(name):
    if name in db.list_collection_names():
        return db[name]
    return None
