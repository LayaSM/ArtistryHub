### Artistry Hub 
Artistry Hub is a platform designed for art enthusiasts to buy and sell artworks. It provides a user-friendly interface for browsing, purchasing, and listing artworks, catering to both artists and art collectors.

# Features
1. User Authentication: Users can sign up for an account to access advanced features such as listing artworks for sale and making offers.
2. Artwork Listings: Artists can create listings for their artworks, providing details such as title, condition, price, and description.
3. Offer Management: Buyers can make offers on artworks listed by artists, and sellers can accept or reject offers.
4. Secure Transactions: The platform ensures secure transactions by validating user inputs and sanitizing data to prevent common vulnerabilities such as XSS attacks.
5. User Profiles: Users have personalized profiles where they can manage their listings, view offers they've made or received, and track their activity on the platform.

# Technologies Used
1. MongoDB: Database system used to store user information, artwork listings, and offer data.
2. Express.js: Web application framework for Node.js used to build the backend server and handle HTTP requests.
3. EJS: Templating engine for generating dynamic HTML content, used to render frontend views and display data from the server.
4. Express Validator: Middleware for validating and sanitizing user input data, ensuring data integrity and security.
5. Passport.js: Authentication middleware for Node.js used to handle user authentication and session management.

# Getting Started
- Clone the repository: git clone <repository-url>
- Install dependencies: npm install
- Set up MongoDB database and configure connection string in .env file.
- Start the server: npm start
- Access the application at http://localhost:3000

# Code Highlights
- Offer Management: The platform implements offer management functionality, allowing users to make offers on artworks and sellers to accept or reject offers. Offers are associated with specific artworks and can be managed through user profiles.
- Security Measures: Input validation and data sanitization measures are implemented to ensure data integrity and protect against common security threats such as XSS attacks. Validation rules enforce minimum password length, valid email format, and acceptable values for artwork conditions and prices.
Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for any improvements or features you'd like to add.

License
This project is licensed under the MIT License - see the LICENSE file for details.

