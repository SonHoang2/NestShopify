# NestShopify
    
## Overview
An e-commerce website sells products directly to users, offering easy browsing, secure payments, and home delivery, making shopping convenient and accessible from any device.

## Technology
- Back End: NodeJS, NestJS, Typescript
- Database: PostgreSQL, Redis
- Architectural Pattern: Controller-Service-Repository


## Features
- **User Authentication and Authorization:**
Provides secure functionality for user registration, login, and email verification. Supports Google-based social login and implements ACL-based access control for managing user permissions effectively.

- **Role Management:**
Facilitates role-based access with predefined roles like admin and customer. Admins can create, update, delete roles, and assign them to specific users for better control.

- **Permission Management:**
Admins have the ability to create, view, and delete permissions. These permissions are assigned to roles to define and manage access levels clearly.

- **Category Management:**
Allows admins to perform CRUD operations for categories and organize banner images by position and category. Categories can also be activated or deactivated based on their status.

- **Item Management:**
Enables CRUD operations for items with detailed attributes such as name, barcode, price, weight, quantity, description, thumbnail, and multiple images. Automatically updates stock quantities after successful purchases to ensure accuracy.

- **Order Management:**
Provides full CRUD operations for managing orders efficiently. Also includes monthly and yearly sales reporting to track business performance.

- **Voucher Management:**
Offers promotional discounts that users can apply to their orders within a specified time frame. Each voucher is limited by time and quantity, requiring timely redemption before they expire or run out.

- **Flash Sale Management:**
Handles flash sale timing, pricing, and the availability of items during these events. Ensures seamless management of limited-time promotions to boost sales.

- **Notification System:**
Sends automated email notifications to users 15 minutes before a flash sale begins. Keeps users informed and engaged with timely updates.


## Database Design
![alt text](database_design.png)

## Setting Up Your Local Environment 
- File `.env` located in the client folder
```
REACT_APP_CLIENT_URL=your client link
REACT_APP_SERVER_URL=your server link 
REACT_APP_GOOGLE_CLIENT_ID=your google id
```

- File `config.env` located in the server folder

```
GOOGLE_CLIENT_ID=your google id
GOOGLE_CLIENT_SECRET=your secret google id

# DATABASE
DB_TYPE=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# REDIS
REDIS_HOST=
REDIS_PORT=

# JWT
JWT_SECRET=your JSON web token secret (I recommend string with at least 32 characters for Security)

# mail
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=

#server
SERVER_URL=

#server store image
IMGBB_API_KEY=

#Use to increase app performance
CLUSTER_MODE=true|false

```
## Author

Hi, I'm the creator and maintainer of this project. I'm passionate about software development and always eager to improve. If you find this project helpful, please consider giving it a star ⭐ – your support means a lot!  

If you encounter any bugs or issues, feel free to report them via email. I appreciate your feedback!  

📧 **Email:** naruto3285@gmail.com

If you want to learn more about this project API, you can visit this link.
<a href="https://documenter.getpostman.com/view/19507372/2sA3kbfHgq#186c0ec4-0ef7-4976-ab7c-4360295bde63">nestshopify</a>
