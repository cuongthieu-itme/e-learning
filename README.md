# E-Learning Platform

Welcome to the E-Learning Platform, a modern and fully functional educational platform built using Next.js, TypeScript, and Tailwind CSS. This platform allows users to browse courses, explore topics, and engage with educational content. It also includes an Admin Dashboard for managing courses, topics, lectures, and user data.

## Features

- **User Authentication**: User registration, login, and authentication mechanisms to ensure secure access.
- **Course Management**: Browse, search, and filter courses with comprehensive details.
- **Course Topics**: Explore various topics within courses, including randomly featured topics.
- **Admin Dashboard**: Manage courses, topics, lectures, and users through an intuitive administrative interface.

## Technologies Used

- **Frontend**

  - **React with TypeScript**
  - **Next.js for server-side rendering and routing**
  - **Tailwind CSS for responsive and modern UI design**

- **Backend**
  - **NestJS for building efficient and scalable server-side applications**
  - **MongoDB for database management**
  - **CSRF Protection** for enhanced security

## Installation

1. **Clone the Repository:**

```bash
git clone https://github.com/yourusername/e-learning.git
```

2. **Frontend Setup:**

- Navigate to the client directory:

```bash
cd client
```

- Install dependencies:

```bash
pnpm install
```

- Add a .env file in the client directory and configure the necessary environment variables. Use .env.example as a reference.

3. **Backend Setup:**

- Navigate to the api directory::

```bash
cd api
```

- Install dependencies:

```bash
pnpm install
```

Add a .env file in the api directory and configure the necessary environment variables. Use .env.example as a reference.

4. **Start Servers:**

- Frontend

```bash
pnpm start:client
```

- Backend

```bash
pnpm start:api
```

## Usage

Create an account and start exploring the platform's educational content:

1. Browse all available courses with advanced filtering and search options
2. Explore course topics and related materials
3. View featured random topics on the homepage
4. Access detailed course information

## Admin Access

Users cannot sign in as an admin by default. To gain admin privileges, you must use your MongoDB account and manually update the user's role in MongoDB Atlas by changing the role property to "admin".

The admin dashboard provides access to:
- Course management (create, edit, delete)
- Topic management
- Lecture management
- User administration

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License.
