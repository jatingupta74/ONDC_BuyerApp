from flask import Blueprint, request, jsonify
import requests
import json
from datetime import datetime
import uuid

products_bp = Blueprint('products', __name__)

# Mock ONDC registry and gateway URLs (replace with actual ONDC endpoints)
ONDC_REGISTRY_URL = "https://registry.ondc.org"
ONDC_GATEWAY_URL = "https://gateway.ondc.org"

# Mock product data for development
MOCK_PRODUCTS = [
    {
        "id": "prod_001",
        "name": "Fresh Organic Apples",
        "description": "Premium quality organic apples, freshly harvested",
        "price": 150.00,
        "currency": "INR",
        "category": "Grocery",
        "subcategory": "Fruits",
        "images": [
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
            "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400"
        ],
        "seller": {
            "id": "seller_001",
            "name": "Fresh Farm Store",
            "rating": 4.5,
            "location": "Mumbai, Maharashtra"
        },
        "availability": True,
        "stock": 50,
        "delivery_time": "2-4 hours",
        "tags": ["organic", "fresh", "fruits", "healthy"]
    },
    {
        "id": "prod_002",
        "name": "Basmati Rice 5kg",
        "description": "Premium quality basmati rice, aged for perfect aroma",
        "price": 450.00,
        "currency": "INR",
        "category": "Grocery",
        "subcategory": "Grains",
        "images": [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
        ],
        "seller": {
            "id": "seller_002",
            "name": "Grain Mart",
            "rating": 4.2,
            "location": "Delhi, NCR"
        },
        "availability": True,
        "stock": 25,
        "delivery_time": "4-6 hours",
        "tags": ["rice", "basmati", "grains", "staple"]
    },
    {
        "id": "prod_003",
        "name": "Wireless Bluetooth Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 2999.00,
        "currency": "INR",
        "category": "Electronics",
        "subcategory": "Audio",
        "images": [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
        ],
        "seller": {
            "id": "seller_003",
            "name": "Tech World",
            "rating": 4.7,
            "location": "Bangalore, Karnataka"
        },
        "availability": True,
        "stock": 15,
        "delivery_time": "1-2 days",
        "tags": ["electronics", "headphones", "wireless", "audio"]
    },
    {
        "id": "prod_004",
        "name": "Cotton T-Shirt",
        "description": "Comfortable 100% cotton t-shirt in various colors",
        "price": 599.00,
        "currency": "INR",
        "category": "Fashion",
        "subcategory": "Clothing",
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
        ],
        "seller": {
            "id": "seller_004",
            "name": "Fashion Hub",
            "rating": 4.3,
            "location": "Chennai, Tamil Nadu"
        },
        "availability": True,
        "stock": 30,
        "delivery_time": "2-3 days",
        "tags": ["fashion", "clothing", "cotton", "casual"]
    }
]

@products_bp.route('/search', methods=['GET'])
def search_products():
    """Search products using ONDC protocol"""
    try:
        # Get search parameters
        query = request.args.get('q', '')
        category = request.args.get('category', '')
        location = request.args.get('location', '')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        # For development, use mock data
        # In production, this would make ONDC /search API call
        filtered_products = MOCK_PRODUCTS.copy()
        
        # Apply filters
        if query:
            filtered_products = [p for p in filtered_products 
                               if query.lower() in p['name'].lower() 
                               or query.lower() in p['description'].lower()
                               or any(query.lower() in tag for tag in p['tags'])]
        
        if category:
            filtered_products = [p for p in filtered_products 
                               if p['category'].lower() == category.lower()]
        
        if min_price is not None:
            filtered_products = [p for p in filtered_products if p['price'] >= min_price]
        
        if max_price is not None:
            filtered_products = [p for p in filtered_products if p['price'] <= max_price]
        
        # Pagination
        start = (page - 1) * limit
        end = start + limit
        paginated_products = filtered_products[start:end]
        
        return jsonify({
            'success': True,
            'data': {
                'products': paginated_products,
                'total': len(filtered_products),
                'page': page,
                'limit': limit,
                'total_pages': (len(filtered_products) + limit - 1) // limit
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/<product_id>', methods=['GET'])
def get_product_details(product_id):
    """Get detailed product information"""
    try:
        # Find product in mock data
        product = next((p for p in MOCK_PRODUCTS if p['id'] == product_id), None)
        
        if not product:
            return jsonify({
                'success': False,
                'error': 'Product not found'
            }), 404
        
        # Add additional details for product page
        detailed_product = product.copy()
        detailed_product.update({
            'specifications': {
                'brand': 'Premium Brand',
                'weight': '1kg',
                'dimensions': '10x10x5 cm',
                'warranty': '1 year'
            },
            'reviews': [
                {
                    'id': 'rev_001',
                    'user': 'John D.',
                    'rating': 5,
                    'comment': 'Excellent quality product!',
                    'date': '2024-06-20'
                },
                {
                    'id': 'rev_002',
                    'user': 'Sarah M.',
                    'rating': 4,
                    'comment': 'Good value for money.',
                    'date': '2024-06-18'
                }
            ],
            'related_products': [p['id'] for p in MOCK_PRODUCTS if p['id'] != product_id][:3]
        })
        
        return jsonify({
            'success': True,
            'data': detailed_product
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get available product categories"""
    try:
        categories = list(set(p['category'] for p in MOCK_PRODUCTS))
        subcategories = {}
        
        for category in categories:
            subcategories[category] = list(set(
                p['subcategory'] for p in MOCK_PRODUCTS 
                if p['category'] == category
            ))
        
        return jsonify({
            'success': True,
            'data': {
                'categories': categories,
                'subcategories': subcategories
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """Get featured products for homepage"""
    try:
        # Return first 4 products as featured
        featured = MOCK_PRODUCTS[:4]
        
        return jsonify({
            'success': True,
            'data': featured
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def create_ondc_search_request(query, location, category=None):
    """Create ONDC-compliant search request"""
    search_request = {
        "context": {
            "domain": "retail",
            "country": "IND",
            "city": location,
            "action": "search",
            "core_version": "1.2.0",
            "bap_id": "buyer-app.ondc.org",
            "bap_uri": "https://buyer-app.ondc.org",
            "transaction_id": str(uuid.uuid4()),
            "message_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        },
        "message": {
            "intent": {
                "item": {
                    "descriptor": {
                        "name": query
                    }
                },
                "fulfillment": {
                    "end": {
                        "location": {
                            "gps": "12.9716,77.5946"  # Default to Bangalore coordinates
                        }
                    }
                }
            }
        }
    }
    
    if category:
        search_request["message"]["intent"]["category"] = {
            "id": category
        }
    
    return search_request

