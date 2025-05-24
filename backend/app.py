from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.passage_routes import passage_bp
from routes.versions_routes import versions_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(passage_bp)
app.register_blueprint(versions_bp)

if __name__ == "__main__":
    app.run(debug=True)
