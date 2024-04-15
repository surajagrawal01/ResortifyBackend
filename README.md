# Resortify Backend

Welcome to the Resortify Backend repository! This project serves as the backend for Resortify, a web application where users can book resorts and owners can register their resorts. The backend implements various features including user authentication, authorization, email verification, booking approval notifications, and payment processing. It is built using Node.js, Express, and MongoDB, along with several other packages for enhanced functionality.

## Features

- **User Authentication**: Secure authentication system for users and owners, ensuring secure access to the platform.
- **User Authorization**: Authorization mechanisms to control user access and permissions based on roles.
- **Email Verification**: Utilizes nodemailer for email verification during user registration, enhancing account security.
- **Booking Approval Notifications**: Sends notifications to owners for new booking requests, facilitating timely response and approval.
- **Payment Processing**: Integrates Stripe for processing payments, ensuring seamless and secure transactions.
- **Password Encryption**: Utilizes bcryptjs for secure password hashing and encryption, safeguarding user credentials.
- **Middleware**: Implements CORS, JWT, multer, and express-validator middleware for enhanced functionality and security.

## Technologies Used

- **Node.js**: A JavaScript runtime environment for server-side development.
- **Express**: A web application framework for Node.js, used for building the backend server.
- **MongoDB**: A NoSQL database used for storing resort and user data.
- **nodemailer**: Module for sending emails, used for email verification and notifications.
- **Stripe**: Payment processing platform for handling transactions securely.
- **cors**: Express middleware for enabling Cross-Origin Resource Sharing (CORS).
- **jsonwebtoken**: JSON Web Token implementation for user authentication.
- **multer**: Middleware for handling multipart/form-data, used for file uploads.
- **express-validator**: Middleware for request validation in Express.js applications.
- **bcryptjs**: Library for password hashing and encryption.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Resortify-Backend.git
2. Install Dependencies
   
   ```bash
   cd Resortify-Backend
   npm install

4. Start the server
   
   ```bash
    node server.js
   
## Usage
Once the server is running, the Resortify Backend provides APIs for user authentication, resort registration, booking management, and payment processing. These APIs can be integrated with the Resortify frontend to create a fully functional web application for users and resort owners.

## Contributing
Contributions are welcome! If you have any suggestions, improvements, or feature requests, feel free to submit a pull request or open an issue.
