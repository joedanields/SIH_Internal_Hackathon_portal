# SIH Internal Hackathon Portal

This project is a web portal for managing an internal hackathon, built with React and Vite. It provides a dashboard for both judges and administrators to manage teams, scores, and view the leaderboard.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Node.js](https://nodejs.org/en/) (v16 or higher)
*   [npm](https://www.npmjs.com/) (v8 or higher)

## Getting Started

To get the project up and running on your local machine, follow these simple steps.

### 1. Clone the Repository

First, clone the repository to your local machine using Git:

```bash
git clone https://github.com/joedanields/SIH_Internal_Hackathon_portal.git
cd SIH_Internal_Hackathon_portal
```

### 2. Install Dependencies

Next, install the project dependencies using npm. This will download and install all the necessary packages defined in `package.json`.

```bash
npm install
```

### 3. Run the Development Server

Once the dependencies are installed, you can start the development server. This will launch the application in development mode with hot-reloading enabled.

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Available Scripts

In the project directory, you can run the following scripts:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.

## Project Structure

The project is organized with the following structure:

```
/
├── public/
│   └── # Static assets
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── common/
│   │   └── judge/
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── JudgeDashboard.jsx
│   │   ├── landing.jsx
│   │   └── manageTeam.jsx
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
└── README.md
```

*   **`src/components`**: Contains reusable UI components.
*   **`src/pages`**: Contains the main page components for each route.
*   **`src/utils`**: Contains utility functions.
*   **`src/main.jsx`**: The main entry point of the application, where the routing is configured.
*   **`public`**: Contains static assets that are publicly accessible.