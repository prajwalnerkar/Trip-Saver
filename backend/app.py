from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from shoproutes import shop_bp 

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(shop_bp) 

if __name__ == '__main__':
    app.run(debug=True, port=5000)