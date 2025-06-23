## ONDC Architecture and Buyer App Requirements

### ONDC Architecture Overview
ONDC (Open Network for Digital Commerce) is a decentralized network built on the Beckn Protocol. It aims to democratize digital commerce by enabling interoperability between buyer and seller applications. The architecture is microservices-based, with independent services communicating to facilitate transactions.

Key components include:
- **Beckn Protocol:** The foundational layer providing specifications for APIs, data models, and transaction mechanisms.
- **Registries:** For discovering network participants (buyer apps, seller apps, logistics providers).
- **Gateways:** Facilitate communication between different network participants.
- **API Specifications:** Standardized APIs for various domains like retail, logistics, and finance, ensuring seamless interaction between different applications on the network.

### Buyer App Requirements and API Specifications
A buyer app on ONDC is the demand-side application that allows end-consumers to discover, search, and purchase products or services from various sellers on the ONDC network. The ONDC SDK provides a white-label buyer app implementation that can be used as a reference.

**Core API functionalities for a buyer app include:**
- **Catalog Search (`/search` and `/on_search`):**
    - Full catalog refresh (by city, downloadable link, by item, by fulfillment end location).
    - Incremental catalog refresh (pull and push mechanisms).
    - Support for various categories (F&B, Grocery, Home & Kitchen, Health & Wellness).
- **Order Flow:**
    - Addition of quote type.
    - Updated `/confirm` and `/on_confirm` flows.
    - Customization options (input - selection, free text) for pre-order and post-order APIs.
    - Exchange of GST number between Buyer NP and Seller NP.
    - PAN number for provider verification of ISN/MSN.
- **Order Tracking:**
    - Hyperlocal tracking using GPS coordinates.
    - Live Order Tracking.
- **Cancellation:**
    - Updated cancel API (non-RTO) and RTO flow for cancellation.
- **Updates (`/update` API):**
    - Merchant part cancel.
    - Return with pickup/liquidation.
    - Cancel return request.
- **Fulfillment:**
    - Enabling self-pickup and slotted delivery.
    - Enabling additional fulfillment states (hyperlocal, inter-city).

**Technical Stack of the Reference Buyer App:**
- **Client:** React JS (v17), Redux, Javascript
- **Mobile:** React Native (v18)
- **Server:** Node JS (v16), Express, Python (v3.7)
- **Database:** MongoDB
- **Architecture:** Microservices (protocol layer in Python, client API layer in Node.js, frontend in React served via Nginx, ancillary APIs in Python for utilities).

This information will be crucial for designing the app architecture and implementing the core features.

