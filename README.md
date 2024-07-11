# Blog Website

An extensive blogging platform providing features such as comments, replies, notifications, likes, and bookmarks.

## Features

- **Comments & Replies**: Engage in discussions through comments and replies.
- **Notifications**: Stay updated with real-time notifications.
- **Likes & Bookmarks**: Like and bookmark your favorite posts.

## Getting Started

### Prerequisites

- Node.js
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Zafeeruddin/blog-website.git
    cd blog-website
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

### Docker Setup

1. Build the Docker image:
    ```bash
    docker build -t blog-website .
    ```

2. Run the Docker container:
    ```bash
    docker-compose up
    ```

## Usage

### Running the Application

To start the application in development mode:
```bash
npm run dev
