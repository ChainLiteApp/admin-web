# ChainLite Admin Dashboard

A modern, responsive admin interface for managing and monitoring the ChainLite blockchain network. Built with React Admin and Material-UI, this dashboard provides a user-friendly way to interact with blockchain nodes, view network status, and manage system configurations.

![ChainLite Admin Dashboard](src/assets/favicon.svg)

## ✨ Features

- **Real-time Monitoring**
  - View network status and health metrics
  - Monitor blockchain nodes and their status
  - Track transactions and blocks in real-time

- **Node Management**
  - View detailed node information
  - Monitor node performance and resource usage
  - Manage node configurations

- **Block Explorer**
  - Browse blocks and transactions
  - View detailed block information
  - Search and filter transactions

- **User Interface**
  - Responsive design for all devices
  - Dark/Light theme support
  - Intuitive navigation and data visualization

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **Admin Framework**: React Admin v4
- **Build Tool**: Vite
- **Styling**: Emotion
- **Package Manager**: Yarn

## 📦 Prerequisites

- Node.js (v16 or higher)
- Yarn (v1.22+ or v2+)
- Access to ChainLite API server

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChainLiteApp/admin-web.git
   cd admin-web
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_API_URL=your_api_url_here
   # Add other environment variables as needed
   ```

4. **Start the development server**
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   yarn build
   ```

## 📂 Project Structure

```
src/
├── assets/           # Static assets (images, icons, etc.)
├── resources/        # React Admin resources
│   ├── Blocks.jsx    # Blocks management
│   ├── Nodes.jsx     # Nodes management
│   └── Transactions.jsx  # Transactions management
├── App.jsx           # Main application component
├── dashboard.jsx     # Dashboard component
├── dataProvider.js   # API data provider
└── main.jsx          # Application entry point
```

## 🔧 Configuration

Edit the `dataProvider.js` file to configure the API endpoints and authentication settings according to your ChainLite API server.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any questions or feedback, please contact [Your Contact Information]
