# cf_ai_chat_with_memory

This is an AI-powered chat application built on Cloudflare Workers AI. It uses Durable Objects to give each user a persistent, anonymous chat history, allowing for contextual conversations. The frontend is a simple HTML page that communicates with the Worker's API.

### Features
*   **Persistent Chat Memory**: Uses a Durable Object to store conversation history for each anonymous user.
*   **Cloudflare Workers AI**: Integrates with a powerful Large Language Model (LLM) for real-time chat responses.
*   **Full Stack on Cloudflare**: The entire application, including the frontend and backend, is deployed on the Cloudflare platform.
*   **Simple Frontend**: A static HTML/JavaScript interface handles user input and displays the chat log.

### Quick way: https://cf-ai-chatbot.ayaan28266.workers.dev/

### Long way is to run the Project Locally

Follow these steps to set up and run the application on your local machine using `wrangler dev`.

#### Step 1: Clone the repository and install dependencies
First, clone your project from GitHub and navigate into the project directory. Then, install the required Node.js dependencies.

```sh
# cf
git clone https://github.com/Innominate-Dev/cf_ai_chatbot.git
cd cf_ai_chatbot
npm install
```
Then to run it type in your terminal 
```
wrangler dev
```
