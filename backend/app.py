import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.passage_routes import passage_bp
from routes.versions_routes import versions_bp

load_dotenv()

app = Flask(__name__)
frontend_prod = os.environ.get("FRONTEND_PROD")
frontend_local = os.environ.get("FRONTEND_LOCAL")
backend_local = os.environ.get("BACKEND_LOCAL")

origins = list(filter(None, [
    frontend_prod,
    frontend_local,
    backend_local
]))
CORS(app, origins=origins)

app.register_blueprint(passage_bp)
app.register_blueprint(versions_bp)

if __name__ == "__main__":
    app.run(debug=True)
