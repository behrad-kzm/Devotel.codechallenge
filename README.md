# Devotel Code Challenge

This project follows a microservice architecture with the following services:

- **authentication-service**: Manages user authentication and Firebase integration.
- **user-service**: Handles user-related operations.
- **image-service**: Manages image-related functionality.
- **post-service**: Handles blog posts creation and management.
- **api-gateway**: The entry point for routing API requests.

## Project Structure

The project directory structure is as follows:

```
project/
|_ services/
   |_ api-gateway/
   |_ authentication-service/
   |_ user-service/
   |_ image-service/
   |_ post-service/
|_ client/
|_ init-scripts/
```

- **services**: Contains all microservices and their respective code.
- **client**: Contains the front-end files, including an HTML page for obtaining the ID token.
- **init-scripts**: Contains scripts to set up the project environment.

## Setup Instructions

### 1. Firebase Setup
1. Sign up for a Firebase account and create a new project.
2. Add a user with an email and password.
3. Create a service account in Firebase and download the `firebase-service-account.json` file.

### 2. Update Client Configuration
1. Navigate to the `client` folder and open the `client-login.html` file.
2. Update the Firebase credentials in the file with your Firebase project details.

### 3. Set Up Authentication Service
1. Place the `firebase-service-account.json` file in the `authentication-service/envs` folder.

### 4. Running the Project
1. From the root directory, run the following command to build and start the services using Docker Compose:
   
   ```bash
   docker-compose up --build -d
   ```

   This will set up the containers, database, and networking.

### 5. Postman Setup
1. Import the `Devotel.postman_collection.json` file into Postman.
2. Create an environment in Postman and define a variable `{{token}}`.
3. In Postman, get the `idToken` by running the `client-login.html` file in your browser, then copy and paste the token into the `{{token}}` variable.

### 6. Create a User
1. Use Postman to create a user by sending a POST request to `/users`.

### 7. Creating Posts
- To create a post, the user must have the **AUTHOR** or **ADMIN** role.

## Postman Collection

The Postman collection `Devotel.postman_collection.json` contains all the necessary API requests for interacting with the services. Make sure to set the appropriate headers and authentication token in your requests.
