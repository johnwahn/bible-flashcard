from flask import Blueprint, request, jsonify
from utils.bible_parser import parse_range
from utils.database import get_db_collection
import requests
import os

passage_bp = Blueprint('passage', __name__)

# Lambda Endpoint
@passage_bp.route('/passage', methods=['GET'])
def get_passage():
    from os import environ
    api_key = request.headers.get('x-api-key')
    if api_key != environ.get("GATEWAY_API_KEY"):
        return jsonify({"message": "Unauthorized"}), 401
    try:
        search = request.args.get('search')
        version = request.args.get('version', 'esv').lower()

        if not search:
            return jsonify({"error": "Missing query parameter: search"}), 400

        collection = get_db_collection(f"bible_{version}")
        if collection is None:
            return jsonify({"error": f"Version '{version}' not found"}), 404

        book, chapter, start_verse, end_verse = parse_range(search)

        query = {
            "book": book,
            "chapter": chapter,
            "verse": {"$gte": start_verse, "$lte": end_verse}
        }

        results = list(collection.find(query))
        results.sort(key=lambda doc: doc["verse"])

        verses = [{"book": doc["book"], "chapter": doc["chapter"], "verse": doc["verse"], "text": doc["text"]} for doc in results]
        return jsonify(verses)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Proxy endpoint
@passage_bp.route('/api/fetch-verse', methods=['GET'])
def proxy_fetch_verse():
    try:
        search = request.args.get('search')
        version = request.args.get('version', 'esv')
        if not search:
            return jsonify({"error": "Missing search parameter"}), 400

        data, status = fetch_passage_from_gateway(search, version)
        return jsonify(data), status

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper method
def fetch_passage_from_gateway(search, version):
    url = f"{os.environ.get('LOCAL_HOST')}/passage"
    headers = {
        'x-api-key': os.environ.get("GATEWAY_API_KEY")
    }
    params = {
        'search': search,
        'version': version
    }

    response = requests.get(url, headers=headers, params=params)
    return response.json(), response.status_code