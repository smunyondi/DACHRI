# DACHRI SHOES Frontend

## Overview
DACHRI SHOES is an online shoe store built using modern web technologies. This project features a user-friendly interface for browsing products, purchasing shoes, rating items, and leaving comments. It also includes user authentication, an admin interface for managing products, and a receipt generation feature.

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Package Manager**: pnpm

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- pnpm (install via npm: `npm install -g pnpm`)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd DACHRI-SHOES
   ```

2. Navigate to the frontend directory:
   ```
   cd frontend
   ```

3. Install dependencies:
   ```
   pnpm install
   ```

### Running the Application

1. Start the development server:
   ```
   pnpm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000` to view the application.

### Features
- User authentication (sign up, sign in, logout)
- Product browsing and purchasing
- Rating and commenting on products
- Admin interface for product management
- Receipt generation after purchase

### Folder Structure
- `src/`: Contains all the source code for the frontend application.
  - `components/`: Reusable components like ProductCard and Cart.
  - `pages/`: Different pages of the application, such as Home.
  - `routes/`: Client-side routing configuration.
  - `hooks/`: Custom hooks for managing authentication.
  - `utils/`: Utility functions for API calls.

### Customization
You can customize the styles and components as per your requirements using Tailwind CSS.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.