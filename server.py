import openai
from flask import Flask, send_from_directory, request, jsonify, Response, stream_with_context
from groq import Groq


app = Flask(__name__, static_folder="static")

# Set your OpenAI API key
openai.api_key = "<open_ai_key>"

# Groq API key
GROQ_API_KEY = "<groq_key>"

# Serve the index.html from the static folder
@app.route("/")
def serve_index():
    return send_from_directory("static", "index.html")

# Serve other static files (CSS, JS, etc.)
@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory("static", path)

# KG Graph API Endpoint
@app.route("/kg-graph", methods=["GET"])
def kg_graph():
    # Simulated KG Graph text
    response = {"kg_graph_text": "This is the simulated KG Graph output."}
    return jsonify(response)

# API Endpoint: ChatGPT
@app.route("/chatgpt", methods=["POST"])
def chatgpt():
    try:
        # Parse the incoming request
        data = request.json
        question = data.get("question", "")

        if not question:
            return jsonify({"error": "Question is required"}), 400

        # Send the question to OpenAI's ChatGPT API using the new method
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use "gpt-4" if available
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": question},
            ],
        )

        # Extract the reply from OpenAI's response
        answer = response["choices"][0]["message"]["content"]
        return jsonify({"response": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/groq", methods=["POST"])
def groq():
    try:
        data = request.json
        question = data.get("question", "")

        if not question:
            return jsonify({"error": "Question is required"}), 400

        # Initialize the Groq client
        client = Groq()

        # Create the Groq completion request
        completion = client.chat.completions.create(
            model="llama3-groq-70b-8192-tool-use-preview",
            messages=[{"role": "user", "content": question}],
            temperature=0.5,
            max_tokens=300,
            top_p=0.65,
            stream=True,
            stop=None,
        )

        # Collect chunks into a single response
        response_text = ""
        for chunk in completion:
            response_text += chunk.choices[0].delta.content or ""

        # Return the accumulated response as JSON
        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API Endpoint: Custom Response
@app.route("/custom-response", methods=["POST"])
def custom_response():
    data = request.json
    question = data.get("question", "")
    # Simulate a longer custom response
    response_text = (
        f"Response: {question}. "
        "This is a simulated custom hardcoded response. "
        "It is designed to demonstrate word-by-word rendering in the application. "
        "This response is deliberately made longer so that the behaviour can be fully appreciated."
    )
    response = {"response": response_text}
    return jsonify(response)


if __name__ == "__main__":
    app.run(port=8001, debug=True)
