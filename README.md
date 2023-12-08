# MERN Chat App

Chat HuB, a communication platform built on the MERN (MongoDB, Express, React, Node.js) stack, enhanced with the ws (Node.js WebSocket library). Provides a seamless environment for discovering and engaging with potential conversation partners. Facilitating not only casual interactions but also serving as a professional space for sharing thoughts, ideas, and fostering real-time communication, Chat HuB is designed to optimize connectivity and collaboration. Elevate your messaging experience with Chat HuB.


## Features

User Friendly Sign Up
- Seamlessly create your Chat HuB account using your email and chosen password.

Communication Hub
-  Engage in instant communication with friends and contacts in real time.

Online/Offline Status
- Easily identify the availability of your contacts through a color-coded status indicator (e.g., green for online, grey for offline)
## Tech Stack

**Client:** React, ReactTypeScript, Redux Toolkit, Material UI, Formik

**API Handlers:** RTK Query

**Server:** Node, Express

**Database:** Mongo DB

**CSS Library:** Tailwind CSS

**Communication:** (WS): a Node.js WebSocket library








## Screenshots

![signup](https://i.postimg.cc/0NyJpXQM/Sign-Up.png)

![Sign in](https://i.postimg.cc/2S6zGsQD/Login.png)

![Chat1](https://i.postimg.cc/kX53PxBN/Chat1.png)

![Chat2](https://i.postimg.cc/d0h0NXTz/Chat2.png)

![Chat3](https://i.postimg.cc/TYKHwJgT/Chat3.png)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Backend ###

```bash
 NODE_ENV:  development
 PORT:      5000
 DATABASE:  Insert your MongoDB database connection link
```

### Frontend ###

```bash
 REACT_APP_API_URL:  'http://127.0.0.1:5000/api/v1/'
```



## API Reference

### ROUTES

- Endpoint: `http://127.0.0.1:5000/api/v1/users`
- Endpoint: `http://127.0.0.1:5000/api/v1/messages`

### USER API

#### Signup
- **Method:** `POST`
- **Endpoint:** `/signup`

#### Login
- **Method:** `POST`
- **Endpoint:** `/login`

#### Get All Users
- **Method:** `GET`
- **Endpoint:** `/`

### MESSAGES API

#### Get Single User Messages
- **Method:** `GET`
- **Endpoint:** `/:userId`
