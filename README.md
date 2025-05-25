# AI Portfolio Analyzer

This project is an Angular application designed to analyze investment portfolios using AI-driven insights.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js and npm:** Angular requires Node.js. npm (Node Package Manager) comes with Node.js.
    *   You can download Node.js from [nodejs.org](https://nodejs.org/).
    *   It's recommended to use an LTS (Long Term Support) version.
*   **Angular CLI:** The Angular Command Line Interface is used to create, manage, and build Angular projects.
    *   Install it globally by running:
        ```bash
        npm install -g @angular/cli
        ```

## Getting Started

Follow these steps to get your development environment set up:

1.  **Clone the Repository:**
    If you haven't already, clone this repository to your local machine.
    ```bash
    git clone <your-repository-url>
    cd ai-portfolio-analyzer
    ```
    (Replace `<your-repository-url>` with the actual URL of your Git repository)

2.  **Install Dependencies:**
    Navigate to the project's root directory (where `package.json` is located) and install the necessary npm packages.
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables (API Key):**
    This application requires an API key for the Gemini service to function.
    *   **Important Security Note:** For public repositories, never commit your API key directly. The recommended approach is to use a backend proxy to handle API requests securely.
    *   If you are proceeding with a client-side key for development or a private setup where the key is injected during a secure build process:
        *   The application might expect the API key to be available via `process.env.API_KEY` (as suggested by recent code changes). Ensure your build process or local environment setup makes this variable accessible to the Angular application at build time.
        *   Alternatively, if using Angular's `environment.ts` files, you would typically configure it there:
            Create or modify `src/environments/environment.ts` (for development) and `src/environments/environment.prod.ts` (for production builds).
            Example for `src/environments/environment.ts`:
            ```typescript
            export const environment = {
              production: false,
              api_key: 'YOUR_GEMINI_API_KEY_HERE' // Replace with your actual API key
            };
            ```
            **Remember to add `src/environments/environment.ts` to your `.gitignore` file if it contains sensitive keys and you plan to commit it for local use.**

4.  **Run the Development Server:**
    Once dependencies are installed and environment variables (if applicable) are set up, you can start the Angular development server.
    ```bash
    ng serve
    ```
    Or, to automatically open it in your default browser:
    ```bash
    ng serve -o
    ```
    The application will typically be available at `http://localhost:4200/`. The server will automatically reload if you change any ofthe source files.

## Building for Production

To create a production build of the application, run:
```bash
ng build --configuration production
```
Or simply:
```bash
ng build
```
(The `--configuration production` flag is often the default for `ng build` in newer Angular versions).

The build artifacts will be stored in the `dist/` directory.

---

Feel free to add more sections like "Features", "Contributing", or "Deployment" as your project evolves.