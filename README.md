# Ecommerce

Welcome to the Ecommerce Project, a modern and fully functional eCommerce platform built using Next.js, TypeScript, and Tailwind CSS. This platform allows users to browse products, manage their shopping cart, and securely complete purchases. It also includes an Admin Dashboard for managing products, orders, and user data.

## Features

- **User Authentication**: User registration, login, and authentication mechanisms to ensure secure access.
- **Product Management**: Add, edit, delete, and view products with comprehensive details.
- **Shopping Cart**: Add products to the cart, update quantities, and proceed to checkout.
- **Admin Dashboard**: Manage products, orders, coupons and users through an intuitive administrative interface.

## Technologies Used

- **Frontend**

  - **React with TypeScript**
  - **Next.js for server-side rendering and routing**
  - **Tailwind CSS for responsive and modern UI design**

- **Backend**
  - **NestJS for building efficient and scalable server-side applications**
  - **MongoDB for database management**

## Installation

1. **Clone the Repository:**

```bash
git clone https://github.com/Dzenoo/Ecommerce.git
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

Create account and start exploring application.

## Admin Access

Users cannot sign in as an admin by default. To gain admin privileges, you must use your MongoDB account and manually update the user's role in MongoDB Atlas by changing the role property to "admin".

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License.
