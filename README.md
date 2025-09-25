# Daf Quiz

Daf Quiz is a web application that generates a daily multiple-choice quiz based on the current Daf Yomi, the daily regimen of learning the Talmud.

It fetches the daily page from the Sefaria API, uses Google's Gemini model via Genkit to generate questions, and provides an interactive quiz experience for users to test their knowledge.

## Features

- **Daily Quiz:** A new 5-question quiz is generated every day based on the Daf Yomi schedule.
- **AI-Powered:** Uses Google's Gemini model to create relevant and challenging questions from the source text.
- **Server-Side Caching:** The daily quiz is generated once and cached on the server to ensure fast load times for all users.
- **Interactive UI:** A clean and modern interface for taking the quiz, built with ShadCN UI and Tailwind CSS.
- **Answer Review:** Users can review their answers and see references to the source text on Sefaria.org.
- **Social Sharing:** Easily share your quiz score on social media.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **AI:** [Genkit](https://firebase.google.com/docs/genkit) with Google Gemini
- **Data Source:** [Sefaria API](https://github.com/Sefaria/Sefaria-Project/wiki/API)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Containerization:** [Docker](https://www.docker.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- pnpm (or your preferred package manager)
- A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

## Running with Docker

You can also run the application using Docker and Docker Compose.

1.  **Ensure your `.env` file is created** as described in the local setup instructions.

2.  **Build and run the container:**
    ```bash
    docker-compose up --build
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000). The cache directory is mounted as a volume to persist the daily quiz across container restarts.
