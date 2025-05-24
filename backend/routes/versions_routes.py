from flask import Blueprint, request, jsonify
from utils.database import get_db_collection
import os
import requests

versions_bp = Blueprint('versions', __name__)

# Lambda Endpoint
@versions_bp.route('/bible-versions', methods=['GET'])
def get_versions():
    api_key = request.headers.get('x-api-key')
    print("API Key is ", api_key)
    if api_key != os.environ.get("GATEWAY_API_KEY"):
        return jsonify({"message": "Unauthorized, keys do not match"}), 401

    try:
        collection = get_db_collection("bible_versions")
        versions = list(collection.find({}, {"_id": 0}))
        return jsonify(versions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Proxy Endpoint
@versions_bp.route('/api/fetch-versions', methods=['GET'])
def proxy_fetch_versions():
    try:
        data, status = fetch_versions_from_gateway()
        return jsonify(data), status

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Helper Method
def fetch_versions_from_gateway():
    url = f"{os.environ.get('AWS_GATEWAY_URL')}/bible-versions"
    print("IN helper method key is ", os.environ.get("GATEWAY_API_KEY"))
    headers = {
        'x-api-key': os.environ.get("GATEWAY_API_KEY")
    }
    response = requests.get(url, headers=headers)
    return response.json(), response.status_code