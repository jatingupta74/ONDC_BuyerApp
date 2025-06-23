import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
CORS(app, origins=['*'])

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'ONDC Buyer App API is running'})

@app.route('/api/products/search')
def search_products():
    # Mock product data
    products = [
        {
            "id": "prod_001",
            "name": "Fresh Organic Apples",
            "price": 150,
            "images": ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"],
            "seller": {"name": "Fresh Farm Store", "rating": 4.5},
            "rating": 4.5,
            "reviews": 128
        }
    ]
    return jsonify({
        'success': True,
        'data': {
            'products': products,
            'total': len(products),
            'page': 1,
            'limit': 20,
            'total_pages': 1
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

