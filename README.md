[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19792957&assignment_repo_type=AssignmentRepo)
# Express.js RESTful API Assignment

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Assignment Overview

You will:
1. Set up an Express.js server
2. Create RESTful API routes for a product resource
3. Implement custom middleware for logging, authentication, and validation
4. Add comprehensive error handling
5. Develop advanced features like filtering, pagination, and search

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   npm start
   ```

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## API Endpoints

The API will have the following endpoints:

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the README.md
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

# Express.js Assignment

## How to Run the Server

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   Or, to run without nodemon:
   ```bash
   node index.js
   ```
   (Replace `index.js` with your main server file if different, e.g., `server.js`)

## API Endpoints

### Example: GET /api/items
- **Description:** Retrieve a list of items.
- **Request:**
  ```http
  GET /api/items
  ```
- **Response:**
  ```json
  [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ]
  ```

### Example: POST /api/items
- **Description:** Create a new item.
- **Request:**
  ```http
  POST /api/items
  Content-Type: application/json

  {
    "name": "New Item"
  }
  ```
- **Response:**
  ```json
  { "id": 3, "name": "New Item" }
  ```

### Example: GET /api/items/:id
- **Description:** Retrieve a single item by ID.
- **Request:**
  ```http
  GET /api/items/1
  ```
- **Response:**
  ```json
  { "id": 1, "name": "Item 1" }
  ```

### Example: PUT /api/items/:id
- **Description:** Update an existing item by ID.
- **Request:**
  ```http
  PUT /api/items/1
  Content-Type: application/json

  {
    "name": "Updated Item"
  }
  ```
- **Response:**
  ```json
  { "id": 1, "name": "Updated Item" }
  ```

### Example: DELETE /api/items/:id
- **Description:** Delete an item by ID.
- **Request:**
  ```http
  DELETE /api/items/1
  ```
- **Response:**
  ```json
  { "message": "Item deleted successfully" }
  ```

---

> Update the endpoint documentation above to match your actual routes and responses.