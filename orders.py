from flask import Blueprint, request, jsonify, session
import uuid
from datetime import datetime, timedelta
import random

orders_bp = Blueprint('orders', __name__)

# In-memory order storage for development
ORDER_STORAGE = {}

@orders_bp.route('/', methods=['GET'])
def get_orders():
    """Get user's order history"""
    try:
        user_id = session.get('user_id', 'anonymous')
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        status = request.args.get('status', '')
        
        # Filter orders by user
        user_orders = [order for order in ORDER_STORAGE.values() 
                      if order['user_id'] == user_id]
        
        # Filter by status if provided
        if status:
            user_orders = [order for order in user_orders 
                          if order['status'].lower() == status.lower()]
        
        # Sort by created date (newest first)
        user_orders.sort(key=lambda x: x['created_at'], reverse=True)
        
        # Pagination
        start = (page - 1) * limit
        end = start + limit
        paginated_orders = user_orders[start:end]
        
        return jsonify({
            'success': True,
            'data': {
                'orders': paginated_orders,
                'total': len(user_orders),
                'page': page,
                'limit': limit,
                'total_pages': (len(user_orders) + limit - 1) // limit
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/<order_id>', methods=['GET'])
def get_order_details(order_id):
    """Get detailed order information"""
    try:
        order = ORDER_STORAGE.get(order_id)
        
        if not order:
            return jsonify({
                'success': False,
                'error': 'Order not found'
            }), 404
        
        # Check if user owns this order
        user_id = session.get('user_id', 'anonymous')
        if order['user_id'] != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized access to order'
            }), 403
        
        return jsonify({
            'success': True,
            'data': order
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/create', methods=['POST'])
def create_order():
    """Create a new order from cart"""
    try:
        data = request.get_json()
        delivery_address = data.get('delivery_address')
        payment_method = data.get('payment_method')
        
        if not delivery_address or not payment_method:
            return jsonify({
                'success': False,
                'error': 'Delivery address and payment method are required'
            }), 400
        
        # Get cart data (mock for development)
        cart_id = session.get('cart_id')
        user_id = session.get('user_id', 'anonymous')
        
        # Mock cart data
        mock_cart = {
            'items': [
                {
                    'id': 'item_001',
                    'product_id': 'prod_001',
                    'name': 'Fresh Organic Apples',
                    'price': 150.0,
                    'quantity': 2,
                    'total_price': 300.0,
                    'seller_id': 'seller_001',
                    'seller_name': 'Fresh Farm Store'
                }
            ],
            'total_amount': 300.0,
            'total_items': 2
        }
        
        if not mock_cart['items']:
            return jsonify({
                'success': False,
                'error': 'Cart is empty'
            }), 400
        
        # Create order
        order_id = str(uuid.uuid4())
        order = {
            'id': order_id,
            'user_id': user_id,
            'status': 'confirmed',
            'items': mock_cart['items'],
            'total_amount': mock_cart['total_amount'],
            'delivery_charges': 50.0,
            'taxes': mock_cart['total_amount'] * 0.18,
            'final_amount': mock_cart['total_amount'] + 50.0 + (mock_cart['total_amount'] * 0.18),
            'delivery_address': delivery_address,
            'payment_method': payment_method,
            'payment_status': 'completed',
            'estimated_delivery': (datetime.utcnow() + timedelta(hours=4)).isoformat(),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'tracking': {
                'current_status': 'Order Confirmed',
                'location': 'Seller Location',
                'estimated_delivery': (datetime.utcnow() + timedelta(hours=4)).isoformat(),
                'tracking_url': f'https://track.ondc.org/{order_id}'
            }
        }
        
        # Save order
        ORDER_STORAGE[order_id] = order
        
        # Clear cart (mock)
        # In production, clear the actual cart
        
        return jsonify({
            'success': True,
            'data': order,
            'message': 'Order created successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/<order_id>/track', methods=['GET'])
def track_order(order_id):
    """Get order tracking information"""
    try:
        order = ORDER_STORAGE.get(order_id)
        
        if not order:
            return jsonify({
                'success': False,
                'error': 'Order not found'
            }), 404
        
        # Check if user owns this order
        user_id = session.get('user_id', 'anonymous')
        if order['user_id'] != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized access to order'
            }), 403
        
        # Mock tracking data with timeline
        tracking_timeline = [
            {
                'status': 'Order Placed',
                'timestamp': order['created_at'],
                'description': 'Your order has been placed successfully',
                'completed': True
            },
            {
                'status': 'Order Confirmed',
                'timestamp': (datetime.fromisoformat(order['created_at'].replace('Z', '')) + timedelta(minutes=15)).isoformat(),
                'description': 'Seller has confirmed your order',
                'completed': True
            },
            {
                'status': 'Preparing',
                'timestamp': (datetime.fromisoformat(order['created_at'].replace('Z', '')) + timedelta(hours=1)).isoformat(),
                'description': 'Your order is being prepared',
                'completed': order['status'] in ['preparing', 'shipped', 'out_for_delivery', 'delivered']
            },
            {
                'status': 'Shipped',
                'timestamp': (datetime.fromisoformat(order['created_at'].replace('Z', '')) + timedelta(hours=2)).isoformat(),
                'description': 'Your order has been shipped',
                'completed': order['status'] in ['shipped', 'out_for_delivery', 'delivered']
            },
            {
                'status': 'Out for Delivery',
                'timestamp': (datetime.fromisoformat(order['created_at'].replace('Z', '')) + timedelta(hours=3)).isoformat(),
                'description': 'Your order is out for delivery',
                'completed': order['status'] in ['out_for_delivery', 'delivered']
            },
            {
                'status': 'Delivered',
                'timestamp': order['estimated_delivery'],
                'description': 'Your order has been delivered',
                'completed': order['status'] == 'delivered'
            }
        ]
        
        tracking_info = {
            'order_id': order_id,
            'current_status': order['status'],
            'estimated_delivery': order['estimated_delivery'],
            'timeline': tracking_timeline,
            'delivery_person': {
                'name': 'Raj Kumar',
                'phone': '+91-9876543210',
                'vehicle': 'Bike - KA01AB1234'
            },
            'live_location': {
                'lat': 12.9716 + random.uniform(-0.01, 0.01),
                'lng': 77.5946 + random.uniform(-0.01, 0.01),
                'last_updated': datetime.utcnow().isoformat()
            }
        }
        
        return jsonify({
            'success': True,
            'data': tracking_info
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/<order_id>/cancel', methods=['POST'])
def cancel_order(order_id):
    """Cancel an order"""
    try:
        data = request.get_json()
        reason = data.get('reason', 'Customer request')
        
        order = ORDER_STORAGE.get(order_id)
        
        if not order:
            return jsonify({
                'success': False,
                'error': 'Order not found'
            }), 404
        
        # Check if user owns this order
        user_id = session.get('user_id', 'anonymous')
        if order['user_id'] != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized access to order'
            }), 403
        
        # Check if order can be cancelled
        if order['status'] in ['delivered', 'cancelled']:
            return jsonify({
                'success': False,
                'error': f'Cannot cancel order with status: {order["status"]}'
            }), 400
        
        # Update order status
        order['status'] = 'cancelled'
        order['cancellation_reason'] = reason
        order['cancelled_at'] = datetime.utcnow().isoformat()
        order['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'success': True,
            'data': order,
            'message': 'Order cancelled successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orders_bp.route('/<order_id>/return', methods=['POST'])
def return_order(order_id):
    """Request order return"""
    try:
        data = request.get_json()
        reason = data.get('reason')
        items = data.get('items', [])
        
        if not reason:
            return jsonify({
                'success': False,
                'error': 'Return reason is required'
            }), 400
        
        order = ORDER_STORAGE.get(order_id)
        
        if not order:
            return jsonify({
                'success': False,
                'error': 'Order not found'
            }), 404
        
        # Check if user owns this order
        user_id = session.get('user_id', 'anonymous')
        if order['user_id'] != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized access to order'
            }), 403
        
        # Check if order can be returned
        if order['status'] != 'delivered':
            return jsonify({
                'success': False,
                'error': 'Only delivered orders can be returned'
            }), 400
        
        # Create return request
        return_id = str(uuid.uuid4())
        return_request = {
            'id': return_id,
            'order_id': order_id,
            'reason': reason,
            'items': items if items else order['items'],
            'status': 'requested',
            'requested_at': datetime.utcnow().isoformat(),
            'pickup_scheduled': False
        }
        
        # Add return request to order
        if 'returns' not in order:
            order['returns'] = []
        order['returns'].append(return_request)
        order['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'success': True,
            'data': return_request,
            'message': 'Return request submitted successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

