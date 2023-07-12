from flask import Flask, render_template, request, jsonify
from chat import get_response

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index_get():
    return render_template("chatbot.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    response, tag = get_response(text)  # Get both response and tag
    message = {"answer": response, "tag": tag}  # Include the "tag" value in the response
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)
