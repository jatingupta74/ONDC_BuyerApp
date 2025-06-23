from flask import Blueprint, request, jsonify
import requests
import json
import uuid
from datetime import datetime
import hashlib
import base64

ondc_bp = Blueprint('ondc', __name__)

# ONDC Configuration (replace with actual values)
ONDC_CONFIG = {
    'registry_url': 'https://registry.ondc.org',
    'gateway_url': 'https://gateway.ondc.org',
    'subscriber_id': 'buyer-app.ondc.org',
    'subscriber_uri': 'https://buyer-app.ondc.org',
    'private_key': None,  # Load from file in production
    'public_key': None,   # Load from file in production
    'domain': 'retail',
    'country': 'IND',
    'core_version': '1.2.0'
}

@ondc_bp.route('/search', methods=['POST'])
def ondc_search():
    """Send search request to ONDC network"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        location = data.get('location', 'Bangalore')
        category = data.get('category')
        
        # Create ONDC search request
        search_request = create_search_request(query, location, category)
        
        # In production, send to actual ONDC gateway
        # response = send_to_ondc_gateway(search_request)
        
        # Mock response for development
        mock_response = create_mock_search_response(search_request)
        
        return jsonify({
            'success': True,
            'data': mock_response,
            'request_id': search_request['context']['message_id']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ondc_bp.route('/select', methods=['POST'])
def ondc_select():
    """Send select request to ONDC network"""
    try:
        data = request.get_json()
        provider_id = data.get('provider_id')
        items = data.get('items', [])
        fulfillment_end = data.get('fulfillment_end')
        
        if not provider_id or not items:
            return jsonify({
                'success': False,
                'error': 'Provider ID and items are required'
            }), 400
        
        # Create ONDC select request
        select_request = create_select_request(provider_id, items, fulfillment_end)
        
        # Mock response for development
        mock_response = create_mock_select_response(select_request)
        
        return jsonify({
            'success': True,
            'data': mock_response,
            'request_id': select_request['context']['message_id']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ondc_bp.route('/init', methods=['POST'])
def ondc_init():
    """Send init request to ONDC network"""
    try:
        data = request.get_json()
        provider_id = data.get('provider_id')
        items = data.get('items', [])
        billing = data.get('billing')
        fulfillment = data.get('fulfillment')
        
        if not all([provider_id, items, billing, fulfillment]):
            return jsonify({
                'success': False,
                'error': 'Provider ID, items, billing, and fulfillment are required'
            }), 400
        
        # Create ONDC init request
        init_request = create_init_request(provider_id, items, billing, fulfillment)
        
        # Mock response for development
        mock_response = create_mock_init_response(init_request)
        
        return jsonify({
            'success': True,
            'data': mock_response,
            'request_id': init_request['context']['message_id']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ondc_bp.route('/confirm', methods=['POST'])
def ondc_confirm():
    """Send confirm request to ONDC network"""
    try:
        data = request.get_json()
        order = data.get('order')
        
        if not order:
            return jsonify({
                'success': False,
                'error': 'Order data is required'
            }), 400
        
        # Create ONDC confirm request
        confirm_request = create_confirm_request(order)
        
        # Mock response for development
        mock_response = create_mock_confirm_response(confirm_request)
        
        return jsonify({
            'success': True,
            'data': mock_response,
            'request_id': confirm_request['context']['message_id']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ondc_bp.route('/status', methods=['POST'])
def ondc_status():
    """Send status request to ONDC network"""
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        
        if not order_id:
            return jsonify({
                'success': False,
                'error': 'Order ID is required'
            }), 400
        
        # Create ONDC status request
        status_request = create_status_request(order_id)
        
        # Mock response for development
        mock_response = create_mock_status_response(status_request)
        
        return jsonify({
            'success': True,
            'data': mock_response,
            'request_id': status_request['context']['message_id']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ondc_bp.route('/track', methods=['POST'])
def ondc_track():
    """Send track request to ONDC network"""
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        
        if not order_id:
            return jsonify({
                'success': False,
                'error': 'Order ID is required'
            }), 400
        
        # Create ONDC track request
        track_request = create_track_request(order_id)
        
        # Mock response for development
        mock_response = create_mock_track_response(track_request)
        
        return jsonify({
            'success': True,
            'data': mock_response,
            'request_id': track_request['context']['message_id']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def create_ondc_context(action, city='Bangalore'):
    """Create ONDC context object"""
    return {
        'domain': ONDC_CONFIG['domain'],
        'country': ONDC_CONFIG['country'],
        'city': city,
        'action': action,
        'core_version': ONDC_CONFIG['core_version'],
        'bap_id': ONDC_CONFIG['subscriber_id'],
        'bap_uri': ONDC_CONFIG['subscriber_uri'],
        'transaction_id': str(uuid.uuid4()),
        'message_id': str(uuid.uuid4()),
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }

def create_search_request(query, location, category=None):
    """Create ONDC search request"""
    context = create_ondc_context('search', location)
    
    intent = {
        'item': {
            'descriptor': {
                'name': query
            }
        },
        'fulfillment': {
            'end': {
                'location': {
                    'gps': '12.9716,77.5946'  # Default coordinates
                }
            }
        }
    }
    
    if category:
        intent['category'] = {'id': category}
    
    return {
        'context': context,
        'message': {
            'intent': intent
        }
    }

def create_select_request(provider_id, items, fulfillment_end):
    """Create ONDC select request"""
    context = create_ondc_context('select')
    
    return {
        'context': context,
        'message': {
            'order': {
                'provider': {
                    'id': provider_id
                },
                'items': items,
                'fulfillments': [
                    {
                        'end': fulfillment_end
                    }
                ]
            }
        }
    }

def create_init_request(provider_id, items, billing, fulfillment):
    """Create ONDC init request"""
    context = create_ondc_context('init')
    
    return {
        'context': context,
        'message': {
            'order': {
                'provider': {
                    'id': provider_id
                },
                'items': items,
                'billing': billing,
                'fulfillments': [fulfillment]
            }
        }
    }

def create_confirm_request(order):
    """Create ONDC confirm request"""
    context = create_ondc_context('confirm')
    
    return {
        'context': context,
        'message': {
            'order': order
        }
    }

def create_status_request(order_id):
    """Create ONDC status request"""
    context = create_ondc_context('status')
    
    return {
        'context': context,
        'message': {
            'order_id': order_id
        }
    }

def create_track_request(order_id):
    """Create ONDC track request"""
    context = create_ondc_context('track')
    
    return {
        'context': context,
        'message': {
            'order_id': order_id
        }
    }

def create_mock_search_response(request):
    """Create mock search response"""
    return {
        'context': request['context'],
        'message': {
            'catalog': {
                'bpp/providers': [
                    {
                        'id': 'provider_001',
                        'descriptor': {
                            'name': 'Fresh Farm Store'
                        },
                        'locations': [
                            {
                                'id': 'location_001',
                                'gps': '12.9716,77.5946'
                            }
                        ],
                        'items': [
                            {
                                'id': 'item_001',
                                'descriptor': {
                                    'name': 'Fresh Organic Apples',
                                    'short_desc': 'Premium quality organic apples'
                                },
                                'price': {
                                    'currency': 'INR',
                                    'value': '150'
                                },
                                'category_id': 'Fruits',
                                'location_id': 'location_001'
                            }
                        ]
                    }
                ]
            }
        }
    }

def create_mock_select_response(request):
    """Create mock select response"""
    return {
        'context': request['context'],
        'message': {
            'order': {
                'provider': request['message']['order']['provider'],
                'items': request['message']['order']['items'],
                'quote': {
                    'price': {
                        'currency': 'INR',
                        'value': '200'
                    },
                    'breakup': [
                        {
                            'title': 'Item Total',
                            'price': {
                                'currency': 'INR',
                                'value': '150'
                            }
                        },
                        {
                            'title': 'Delivery Charges',
                            'price': {
                                'currency': 'INR',
                                'value': '50'
                            }
                        }
                    ]
                }
            }
        }
    }

def create_mock_init_response(request):
    """Create mock init response"""
    return {
        'context': request['context'],
        'message': {
            'order': {
                **request['message']['order'],
                'quote': {
                    'price': {
                        'currency': 'INR',
                        'value': '227'
                    },
                    'breakup': [
                        {
                            'title': 'Item Total',
                            'price': {
                                'currency': 'INR',
                                'value': '150'
                            }
                        },
                        {
                            'title': 'Delivery Charges',
                            'price': {
                                'currency': 'INR',
                                'value': '50'
                            }
                        },
                        {
                            'title': 'Tax',
                            'price': {
                                'currency': 'INR',
                                'value': '27'
                            }
                        }
                    ]
                },
                'payment': {
                    'type': 'ON-ORDER',
                    'collected_by': 'BAP'
                }
            }
        }
    }

def create_mock_confirm_response(request):
    """Create mock confirm response"""
    return {
        'context': request['context'],
        'message': {
            'order': {
                **request['message']['order'],
                'id': str(uuid.uuid4()),
                'state': 'Accepted',
                'created_at': datetime.utcnow().isoformat() + 'Z',
                'updated_at': datetime.utcnow().isoformat() + 'Z'
            }
        }
    }

def create_mock_status_response(request):
    """Create mock status response"""
    return {
        'context': request['context'],
        'message': {
            'order': {
                'id': request['message']['order_id'],
                'state': 'In-progress',
                'fulfillments': [
                    {
                        'id': 'fulfillment_001',
                        'state': {
                            'descriptor': {
                                'code': 'Order-picked-up'
                            }
                        },
                        'tracking': True
                    }
                ]
            }
        }
    }

def create_mock_track_response(request):
    """Create mock track response"""
    return {
        'context': request['context'],
        'message': {
            'tracking': {
                'url': f'https://track.ondc.org/{request["message"]["order_id"]}',
                'location': {
                    'gps': '12.9716,77.5946'
                },
                'status': 'active'
            }
        }
    }

