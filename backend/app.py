from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import os
from dotenv import load_dotenv
import re
from bible.bible_aliases import BOOK_ALIASES

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["bible"]

app = Flask(__name__)
CORS(app)

def parse_range(reference: str):
    # Match pattern like "창 1:1-3" or "Genesis 1:1-3" and make case insensitive
    match = re.match(r"([^\d]+)\s*(\d+):(\d+)(?:-(\d+))?", reference.strip(), re.IGNORECASE)
    if not match:
        raise ValueError("Invalid reference format")

    book_raw, chapter, start_verse, end_verse = match.groups()
    
    # Normalize book name case for English keys by lowercasing book_raw before lookup
    # But if Korean or other languages, keep as is
    if re.match(r'[a-zA-Z]', book_raw.strip()[0]):  # If first char is a letter, assume English
        book_key = book_raw.strip().lower()
        # Assuming your BOOK_ALIASES uses lower case keys for English
        book = BOOK_ALIASES.get(book_key, book_raw.strip())
    else:
        # For non-English, keep original (like Korean)
        book = BOOK_ALIASES.get(book_raw.strip(), book_raw.strip())

    chapter = int(chapter)
    start = int(start_verse)
    end = int(end_verse) if end_verse else start

    return book, chapter, start, end

@app.route('/passage', methods=['GET'])
def get_verses():
    
    api_key = request.headers.get('x-api-key')
    if api_key != os.environ.get('GATEWAY_API_KEY'):
        return jsonify({"message": "Unauthorized"}), 401
    
    try:
        search = request.args.get('search')
        version = request.args.get('version', 'esv').lower() # Default to ESV

        if not search:
            return jsonify({"error": "Missing query parameter: search"}), 400

        collection_name = f"bible_{version}"
        if collection_name not in db.list_collection_names():
            return jsonify({"error": f"Version '{version}' not found"}), 404

        collection = db[collection_name]

        book, chapter, start_verse, end_verse = parse_range(search)

        # Mongo query: find verses with book, chapter, and verse between start and end
        query = {
            "book": book,
            "chapter": chapter,
            "verse": {"$gte": start_verse, "$lte": end_verse}
        }

        results = list(collection.find(query))

        # Sort results by verse number ascending
        results.sort(key=lambda doc: doc["verse"])

        verses = [{"book": doc["book"], "chapter": doc["chapter"], "verse": doc["verse"], "text": doc["text"]} for doc in results]

        return jsonify(verses)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/bible-versions', methods=['GET'])
def get_bible_versions():
    api_key = request.headers.get('x-api-key')
    if api_key != os.environ.get('GATEWAY_API_KEY'):
        return jsonify({"message": "Unauthorized"}), 401
    try:
        versions_collection = db["bible_versions"]
        versions = list(versions_collection.find({}, {"_id": 0}))  # Exclude _id from output
        return jsonify(versions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
