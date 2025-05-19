from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import os
from dotenv import load_dotenv
import re
from bible.kor_bible_aliases import BOOK_ALIASES

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# MongoDB setup
client = MongoClient(MONGO_URI)
db = client["bible"]
collection = db["verses"]

# Flask app
app = Flask(__name__)
CORS(app)

# Utility function to parse "창1:1-10" format
def parse_range(reference: str):
    # Match both single and range (e.g., 창1:1 or 창1:1-3)
    match = re.match(r"([^\d]+)(\d+):(\d+)(?:-(\d+))?", reference)
    if not match:
        raise ValueError("Invalid reference format")

    book_raw, chapter, start_verse, end_verse = match.groups()
    book = BOOK_ALIASES.get(book_raw.strip(), book_raw.strip())  # normalize

    chapter = int(chapter)
    start = int(start_verse)
    end = int(end_verse) if end_verse else start  # support single verse

    return [f"{book}{chapter}:{v}" for v in range(start, end + 1)]

# API route
@app.route('/verses', methods=['GET'])
def get_verses():
    try:
        # Sets up query parameter
        range_ref = request.args.get('ref')  # e.g., ?ref=창1:1-10
        if not range_ref:
            return jsonify({"error": "Missing query parameter: ref"}), 400

        verse_ids = parse_range(range_ref)
        results = list(collection.find({"_id": {"$in": verse_ids}}))

        # Sort according to input order
        results.sort(key=lambda doc: verse_ids.index(doc["_id"]))

        # Convert to plain dict
        verses = [{"id": doc["_id"], "text": doc["text"]} for doc in results]
        return jsonify(verses)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
