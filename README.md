# Flask Frontend Application

This is a Flask-based frontend application designed to serve static files and provide various API endpoints for integration with OpenAI's ChatGPT, Groq's API, and a custom Knowledge Graph (KG) API. The application runs on port `8001` and integrates seamlessly with a backend environment.

## Features

- Serves static files including `index.html`, CSS, and JS from the `static` folder.
- Provides multiple API endpoints:
  - `/chatgpt`: Interacts with OpenAI's ChatGPT API.
  - `/groq`: Integrates with Groq's Llama3 API for generating responses.
  - `/kg-graph`: Returns a simulated Knowledge Graph response.
  - `/custom-response`: Provides a simulated custom response for testing.

---

## Prerequisites

1. **Conda Environment**: Ensure you are using the same Conda environment as the backend for consistency. Activate the environment using:
   ```bash
   conda activate <backend_environment_name>
   ```
   Replace `<backend_environment_name>` with the name of your backend environment.

2. **Python Dependencies**:
   Install the required dependencies in the activated environment:
   ```bash
   pip install flask openai groq
   ```

3. **API Keys**:
   - Set up your OpenAI API key: Replace `<open_ai_key>` in the code with your actual OpenAI API key.
   - Set up your Groq API key: Replace `<groq_key>` in the code with your actual Groq API key.

---

## Running the Flask Application

1. **Navigate to the Application Directory**:
   Ensure you are in the directory containing the `app.py` file.

2. **Run the Flask App**:
   Start the application by running:
   ```bash
   python app.py
   ```

3. **Access the Application**:
   Open a browser and navigate to:
   ```
   http://127.0.0.1:8001
   ```
   The app serves the `index.html` file and provides access to the APIs.

---

## API Endpoints

### 1. **ChatGPT Endpoint**
   - **URL**: `/chatgpt`
   - **Method**: `POST`
   - **Payload**:
     ```json
     {
         "question": "<Your question here>"
     }
     ```
   - **Response**:
     ```json
     {
         "response": "<ChatGPT's response>"
     }
     ```

### 2. **Groq Endpoint**
   - **URL**: `/groq`
   - **Method**: `POST`
   - **Payload**:
     ```json
     {
         "question": "<Your question here>"
     }
     ```
   - **Response**:
     ```json
     {
         "response": "<Groq's response>"
     }
     ```

### 3. **KG Graph Endpoint**
   - **URL**: `/kg-graph`
   - **Method**: `GET`
   - **Response**:
     ```json
     {
         "kg_graph_text": "This is the simulated KG Graph output."
     }
     ```

### 4. **Custom Response Endpoint**
   - **URL**: `/custom-response`
   - **Method**: `POST`
   - **Payload**:
     ```json
     {
         "question": "<Your question here>"
     }
     ```
   - **Response**:
     ```json
     {
         "response": "Response: <Your question>. This is a simulated custom response..."
     }
     ```

---

## Development Notes

- **Debugging**: The app runs in debug mode by default. If deploying to production, set `debug=False`.
- **Static Folder**: Place your static files (e.g., HTML, CSS, JS) in the `static` folder.
- **Port**: The app runs on port `8001`. Update the `app.run` call in `app.py` if you need to use a different port.