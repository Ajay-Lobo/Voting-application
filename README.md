# Voting Application Backend

This is the backend for a voting application where users can sign up, view candidates, cast a vote, and view live vote counts. The system has a single admin who manages the candidates, and users can only vote once.

## Functionality
- **User Authentication**: Users can sign up and log in using their unique government ID (Aadhar card) and a password.
- **Candidate Voting**: Users can view a list of candidates and vote for one of them.
- **Vote Counting**: The system tracks votes and provides real-time vote counts, sorted by the number of votes.
- **Admin Controls**: Admins can add, update, and delete candidates but cannot vote.
- **Single Admin**: There is only one admin for the entire system. No additional admins can be added or created.
- **One Vote Per User**: Each user can cast only one vote. Once a vote has been cast, it cannot be changed or revoked.
- **User Profile Management**: Users can view and update their password.
- **Secure Access**: Users can log in only using their Aadhar card and password. Passwords are securely hashed, and admins cannot vote.
- **Daily Log Rotation**: Logs are managed with daily rotation for better organization and maintenance.



## Technologies Used
- **Node.js** with **Express.js** for the backend framework.
- **MongoDB** as the database.
- **JWT** for authentication.
- **Bcrypt** for password hashing.
- **Mongoose** for MongoDB object modeling.
- **Winston**: A logging library for Node.js that provides various logging transports and customization.
- **Winston-Daily-Rotate-File**: A Winston transport that handles daily log rotation, ensuring that logs are organized and managed effectively.


## Environment Variables

To run this application, you need to set up the following environment variables in a `.env` file:

```plaintext
PORT=<port_number>               
MONGO_URI=<your_mongoDB_connection_string>  
JWT_SECRET=<your_jwt_secret>  

