<img src="./frontend/public/logo.svg" alt="Loop Logo" height="50">

**Loop** is a streamlined, one-page social media experience designed to deliver relevant, contextualized content in a distraction-free feed. This simplicity combats information overload, while personalized curation ensures every post resonates with the user. Loop's unique edge lies in its focus on genuine, minimalistic interaction.

"Stay in the Loop, without the noise"

## Table of Contents

- [Overview](#overview)
- [User Persona](#user-persona)
- [Product Vision](#product-vision)
- [Metrics Structure](#metrics-structure)
  - [North Star Metric](#north-star-metric)
  - [Proxy Metrics](#proxy-metrics)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [License](#license)

## Overview

In today’s hyper-connected world, users crave a platform that delivers real-time, relevant content on a single, simple feed. However, social media users frequently encounter a range of pains across major platforms, including:

- **Pressure to Maintain a Perfect Image¹**: Approximately 29% of young adults feel pressured to post content that garners likes and comments, leading to anxiety over personal image management. This pressure often results in stress and self-esteem issues as individuals compare their lives to curated online personas.
- **Overwhelm from Constant Drama¹**: About 38% of young adults report feeling overwhelmed by the drama present on social media platforms. This constant influx of negative interactions can lead to emotional fatigue and a desire to disengage from social media altogether.
- **Fear of Missing Out (FOMO)²**: A significant 31% of young adults express feelings of exclusion when they see friends engaging in activities without them. This FOMO can exacerbate feelings of loneliness and dissatisfaction with their own social lives.
- **Negative Social Comparisons¹**: Many individuals in this age group experience upward social comparisons, where they feel inferior when comparing their lives to others' seemingly perfect experiences. This phenomenon is linked to increased feelings of envy and lower self-esteem.
- **Concerns Over Privacy and Control¹**: Approximately 60% of young adults feel they have little or no control over the personal information collected by social media companies. This lack of control can lead to anxiety about privacy and data security.
- **Mental Health Impacts¹**: Nearly 32% of young adults believe that social media has a predominantly negative impact on their peers, contributing to widespread concerns about mental health issues such as anxiety and depression within this demographic.

¹Pew Research Center (2023). [Teens and Social Media: Key Findings](https://www.pewresearch.org/short-reads/2023/04/24/teens-and-social-media-key-findings-from-pew-research-center-surveys/)<br/>
²National Institutes of Health (2021). [Social Media Use and Mental Health](https://pmc.ncbi.nlm.nih.gov/articles/PMC8424608/)

## User Persona
Sarah is a 29-year-old marketer and freelancer who values efficiency and simplicity. She uses social media to stay updated on industry trends, connect with peers, and occasionally engage with entertaining content. However, she often feels overwhelmed by clutter and irrelevant ads on major platforms. Privacy is important to her, and she seeks solutions that align with her personal data preferences.

## Product Vision
“Loop exists to provide an instant, topic-centered space where Gen Z and Millennials can quickly connect with content they care about, without the noise of traditional social media.”

## Metrics Structure
### North Star Metric
- **Active Engagement per User (AEPU)**: Measures the depth of user engagement with core features (saving, responding, following topics) as a single score. The metric will be weighted by recency and frequency of interactions to ensure high engagement levels across the user base.

### Proxy Metrics
- **Feed Dwell Time**: Tracks the average time users spend browsing the feed, indicating interest in and relevance of the content.
- **Content Save Rate**: Measures the frequency of users saving posts, showing content value and interest.
- **Response Interaction Rate**: Calculates the average number of responses per post, reflecting user engagement and content quality.
- **Retention Rate (30 Days)**: Tracks the number of users returning after 30 days, revealing long-term value and user satisfaction.
- **Topic Follow Rate**: The frequency with which users follow new topics, showing interest in personalizing and expanding their feed experience.

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
- File Storage: Nginx (in Docker)

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
   git clone https://github.com/igorjpimenta/loop.git
   cd loop
   ```

2. **Set the environment variables**:
    ```bash
    echo 'VITE_API_URL=http://localhost:8000
    ALLOWED_HOSTS=localhost,127.0.0.1
    CORS_ALLOWED_ORIGINS=http://localhost:5173
    DEBUG=True
    DB_HOST="localhost"
    DB_PORT=5432
    DB_NAME="your-database-name"
    DB_USER="your-database-user"
    DB_PASSWORD="your-database-password"
    PGADMIN_USER="your-pgadmin-user"
    PGADMIN_PASSWORD="your-pgadmin-password
    NGINX_PORT=8001
    NGINX_USER="your-nginx-user"
    NGINX_GROUP="your-nginx-group"
    NGINX_UID="your-nginx-uid"
    NGINX_GID="your-nginx-gid"' > .env
    ```

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

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License.

### License Summary

- **Attribution**: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial**: You may not use the material for commercial purposes.
- **ShareAlike**: If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

For more details, please refer to the full license text: [CC BY-NC-SA License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

---

Loop © 2024 by Igor Pimenta is licensed under CC BY-NC-SA 4.0.

This software and its associated documentation are proprietary and confidential. Unauthorized copying, transfer, or use of this software, in source or binary forms, in whole or in part, is strictly prohibited without the express written permission of the Loop Team.

For licensing inquiries, please contact: igorjpimenta+licensing@gmail.com

---

Built with ❤️ by the Loop team
