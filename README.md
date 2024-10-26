# blink

**blink** is a single-page, distraction-free social feed that empowers users to easily find and engage with the content that matters most to them, without privacy concerns or information overload.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [License](#license)

## Overview

In today's hyper-connected world, users crave a platform that delivers real-time, relevant content on a single, simple feed. blink addresses common frustrations such as information overload, distraction fatigue, fragmented interactions, lack of personalization, and privacy concerns.

Our vision is to create a streamlined, one-page social media experience designed to bring relevant, contextualized content in a single, distraction-free feed. This simplicity combats information overload, while personalized curation ensures every post resonates with the user.

## Features

- **Clean Feed**: A minimalist, ad-free feed delivers a steady stream of personalized content.
- **Single-Click Interactions**: Simple engagement options - Save, Respond, Upvote, and Downvote.
- **Customizable Filters**: Organize the feed by user-selected Topics.
- **Popular Posts**: Highlights the day's most-engaged-with content.
- **Followed Topics Only Mode**: Toggle to see only content from followed topics.
- **Smart Recommendations**: Ad-free suggestions for new topics, users, or groups.

## Tech Stack

- Backend: Django REST Framework
- Frontend: React + TypeScript + Tailwind CSS
- Database: PostgreSQL (in Docker)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Python](https://www.python.org/downloads/) 3.12+
- [npm](https://nodejs.org/) 10+
- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/get-started) 27+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.29+

### Installation

1. **Clone the repository**:
   ```
   git clone https://github.com/igorjpimenta/blink.git
   cd blink
   ```

2. **Set the environment variables**:
    ```bash
    echo 'DB_HOST="localhost"
    DB_PORT=5432
    DB_NAME="your-database-name"
    DB_USER="your-database-user"
    DB_PASSWORD="your-database-password"' > .env

3. **Start the PostgreSQL database using Docker**:
   ```bash
   docker-compose --env-file .env up -d
   ```

4. **Create and activate a virtual environment**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

5. **Install backend dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

6. **Run database migrations**:
    ```bash
    python manage.py migrate
    ```

7. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Run the backend server**:
    ```bash
    cd backend
    python manage.py runserver
    ```
    The backend server will start on `http://localhost:8000`.

2. **Run the frontend development server**:
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend application will start on `http://localhost:5173`.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International Public License.

### License Summary

- **Attribution**: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial**: You may not use the material for commercial purposes.
- **NoDerivatives**: If you remix, transform, or build upon the material, you may not distribute the modified material.

For more details, please refer to the full license text: [CC BY-NC-ND License](https://creativecommons.org/licenses/by-nc-nd/4.0/).

---

Copyright © 2024 blink Team. All Rights Reserved.

This software and its associated documentation are proprietary and confidential. Unauthorized copying, transfer, or use of this software, in source or binary forms, in whole or in part, is strictly prohibited without the express written permission of the blink Team.

For licensing inquiries, please contact: igorjpimenta+licensing@gmail.com

---

Built with ❤️ by the blink team
