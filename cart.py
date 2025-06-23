from flask import Blueprint, request, jsonify, session
import uuid
from datetime import datetime

cart_bp = Blueprint('cart', __name__)

# In-memory cart storage for development (use Redis/database in production)
CART_STORAGE = {}

@cart_bp.route('/', methods=['GET'])
def get_cart():
    """Get current user's cart"""
    try:
        # Get user session or create anonymous cart
        user_id = session.get('user_id', 'anonymous')
        cart_id = session.get('cart_id')
        
        if not cart_id:
            cart_id = str(uuid.uuid4())
            session['cart_id'] = cart_id
        
        cart = CART_STORAGE.get(cart_id, {
            'id': cart_id,
            'user_id': user_id,
            'items': [],
            'total_amount': 0.0,
            'total_items': 0,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        })
        
        return jsonify({
            'success': True,
            'data': cart
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@cart_bp.route('/add', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return jsonify({
                'success': False,
                'error': 'Product ID is required'
            }), 400
        
        # Get or create cart
        user_id = session.get('user_id', 'anonymous')
        cart_id = session.get('cart_id')
        
        if not cart_id:
            cart_id = str(uuid.uuid4())
            session['cart_id'] = cart_id
        
        cart = CART_STORAGE.get(cart_id, {
            'id': cart_id,
            'user_id': user_id,
            'items': [],
            'total_amount': 0.0,
            'total_items': 0,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        })
        
        # Mock product data (in production, fetch from products service)
        mock_product = {
            'id': product_id,
            'name': 'Sample Product',
            'price': 100.0,
            'image': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
            'seller_id': 'seller_001',
            'seller_name': 'Sample Store'
        }
        
        # Check if item already exists in cart
        existing_item = next((item for item in cart['items'] if item['product_id'] == product_id), None)
        
        if existing_item:
            existing_item['quantity'] += quantity
            existing_item['total_price'] = existing_item['quantity'] * existing_item['price']
        else:
            cart_item = {
                'id': str(uuid.uuid4()),
                'product_id': product_id,
                'name': mock_product['name'],
                'price': mock_product['price'],
                'quantity': quantity,
                'total_price': mock_product['price'] * quantity,
                'image': mock_product['image'],
                'seller_id': mock_product['seller_id'],
                'seller_name': mock_product['seller_name'],
                'added_at': datetime.utcnow().isoformat()
            }
            cart['items'].append(cart_item)
        
        # Update cart totals
        cart['total_items'] = sum(item['quantity'] for item in cart['items'])
        cart['total_amount'] = sum(item['total_price'] for item in cart['items'])
        cart['updated_at'] = datetime.utcnow().isoformat()
        
        # Save cart
        CART_STORAGE[cart_id] = cart
        
        return jsonify({
            'success': True,
            'data': cart,
            'message': 'Item added to cart successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@cart_bp.route('/update', methods=['PUT'])
def update_cart_item():
    """Update cart item quantity"""
    try:
        data = request.get_json()
        item_id = data.get('item_id')
        quantity = data.get('quantity', 1)
        
        if not item_id:
            return jsonify({
                'success': False,
                'error': 'Item ID is required'
            }), 400
        
        cart_id = session.get('cart_id')
        if not cart_id or cart_id not in CART_STORAGE:
            return jsonify({
                'success': False,
                'error': 'Cart not found'
            }), 404
        
        cart = CART_STORAGE[cart_id]
        
        # Find and update item
        item = next((item for item in cart['items'] if item['id'] == item_id), None)
        if not item:
            return jsonify({
                'success': False,
                'error': 'Item not found in cart'
            }), 404
        
        if quantity <= 0:
            cart['items'].remove(item)
        else:
            item['quantity'] = quantity
            item['total_price'] = item['price'] * quantity
        
        # Update cart totals
        cart['total_items'] = sum(item['quantity'] for item in cart['items'])
        cart['total_amount'] = sum(item['total_price'] for item in cart['items'])
        cart['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'success': True,
            'data': cart,
            'message': 'Cart updated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@cart_bp.route('/remove/<item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    """Remove item from cart"""
    try:
        cart_id = session.get('cart_id')
        if not cart_id or cart_id not in CART_STORAGE:
            return jsonify({
                'success': False,
                'error': 'Cart not found'
            }), 404
        
        cart = CART_STORAGE[cart_id]
        
        # Find and remove item
        item = next((item for item in cart['items'] if item['id'] == item_id), None)
        if not item:
            return jsonify({
                'success': False,
                'error': 'Item not found in cart'
            }), 404
        
        cart['items'].remove(item)
        
        # Update cart totals
        cart['total_items'] = sum(item['quantity'] for item in cart['items'])
        cart['total_amount'] = sum(item['total_price'] for item in cart['items'])
        cart['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'success': True,
            'data': cart,
            'message': 'Item removed from cart successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@cart_bp.route('/clear', methods=['DELETE'])
def clear_cart():
    """Clear all items from cart"""
    try:
        cart_id = session.get('cart_id')
        if not cart_id or cart_id not in CART_STORAGE:
            return jsonify({
                'success': False,
                'error': 'Cart not found'
            }), 404
        
        cart = CART_STORAGE[cart_id]
        cart['items'] = []
        cart['total_items'] = 0
        cart['total_amount'] = 0.0
        cart['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'success': True,
            'data': cart,
            'message': 'Cart cleared successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@cart_bp.route('/summary', methods=['GET'])
def get_cart_summary():
    """Get cart summary for checkout"""
    try:
        cart_id = session.get('cart_id')
        if not cart_id or cart_id not in CART_STORAGE:
            return jsonify({
                'success': True,
                'data': {
                    'total_items': 0,
                    'total_amount': 0.0,
                    'sellers': [],
                    'delivery_charges': 0.0,
                    'taxes': 0.0,
                    'final_amount': 0.0
                }
            })
        
        cart = CART_STORAGE[cart_id]
        
        # Group items by seller
        sellers = {}
        for item in cart['items']:
            seller_id = item['seller_id']
            if seller_id not in sellers:
                sellers[seller_id] = {
                    'seller_id': seller_id,
                    'seller_name': item['seller_name'],
                    'items': [],
                    'subtotal': 0.0
                }
            sellers[seller_id]['items'].append(item)
            sellers[seller_id]['subtotal'] += item['total_price']
        
        # Calculate charges
        delivery_charges = len(sellers) * 50.0  # ₹50 per seller
        taxes = cart['total_amount'] * 0.18  # 18% GST
        final_amount = cart['total_amount'] + delivery_charges + taxes
        
        summary = {
            'total_items': cart['total_items'],
            'total_amount': cart['total_amount'],
            'sellers': list(sellers.values()),
            'delivery_charges': delivery_charges,
            'taxes': taxes,
            'final_amount': final_amount
        }
        
        return jsonify({
            'success': True,
            'data': summary
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

