from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<id>')
def learn(id):
    return render_template('learn_item.html')

if __name__ == '__main__':
    app.run(debug = True, port=5001)