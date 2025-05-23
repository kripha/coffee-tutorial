import uuid
from enum import Enum
from typing import List

from flask import Flask, session
from flask import render_template
from flask import Response, request, jsonify
from pydantic import BaseModel
from collections import Counter
import random
app = Flask(__name__)
app.secret_key = str(uuid.uuid4())

drinks = [
    {
        "id": 0,
        "name": "Espresso",
        "price": 4,
        "img": "../static/images/espresso.jpg",
        "ingredients": ["1 part espresso"],
        "backend_ingredients": ["1 part espresso"],
        "ingredients_map" : [
            {
                "name": "espresso",
                "count": 1,
                "unit": "part"
            },
        ],
        "taste_profile": "Bitter",
        "similar_drinks": ["Macchiato", "Americano"]
    },

    {
        "id": 1,
        "name": "Americano",
        "price": 8,
        "img": "../static/images/americano.jpg",
        "ingredients": ["1 part espresso", "2 parts water"],
        "backend_ingredients": ["1 part espresso", "1 part water", "1 part water"],
        "ingredients_map" : [
            {
                "name": "espresso",
                "count": 1,
                "unit": "part"
            },
            {
                "name": "water",
                "count": 2,
                "unit": "part"
            }
        ],
        "taste_profile": "Bitter",
        "similar_drinks": ["Espresso", "Macchiato"]
    },
    {
        "id": 2,
        "name": "Macchiato",
        "price": 8,
        "img": "../static/images/macchiato.jpg",
        "ingredients": ["2 parts espresso", "1 small part foamed milk"],
        "backend_ingredients": ["1 part espresso", "1 part espresso", "1 small part foamed milk"],
        "ingredients_map" : [
            {
                "name": "espresso",
                "count": 2,
                "unit": "part"
            },
            {
                "name": "foamed milk",
                "count": 1,
                "unit": "small part"
            }
        ],
        "taste_profile": "Bitter",
        "similar_drinks": ["Espresso", "Americano"]
    },
    {
        "id": 3,
        "name": "Cappuccino",
        "price": 12,
        "img": "../static/images/cappuccino.jpg",
        "ingredients": ["1 part espresso", "1 part steamed milk", "1 part foamed milk"],
        "backend_ingredients": ["1 part espresso", "1 part steamed milk", "1 part foamed milk"],
        "ingredients_map" : [
            {
                "name": "espresso",
                "count": 1,
                "unit": "part"
            },
            {
                "name": "steamed milk",
                "count": 1,
                "unit": "part"
            },
            {
                "name": "foamed milk",
                "count": 1,
                "unit": "part"
            },
        ],
        "taste_profile": "Milky",
        "similar_drinks": ["Flat White", "Latte"]
    },
    {
        "id": 4,
        "name": "Flat White",
        "price": 8,
        "img": "../static/images/flat_white.jpg",
        "ingredients": ["1 part espresso", "2 parts steamed milk"],
        "backend_ingredients": ["1 part espresso", "1 part steamed milk", "1 part steamed milk"],
        "ingredients_map" : [
            {
                "name": "espresso",
                "count": 1,
                "unit": "part"
            },
            {
                "name": "steamed milk",
                "count": 2,
                "unit": "part"
            }
        ],
        "taste_profile": "Milky",
        "similar_drinks": ["Latte", "Cappuccino"]
    },
    {
        "id": 5,
        "name": "Latte",
        "price": 12,
        "img": "../static/images/latte.jpg",
        "ingredients": ["1 part espresso", "2 parts steamed milk", "1 small part foamed milk"],
        "backend_ingredients": ["1 part espresso", "1 part steamed milk", "1 part steamed milk", "1 small part foamed milk"],
        "ingredients_map" : [
            {
                "name": "espresso",
                "count": 1,
                "unit": "part"
            },
            {
                "name": "steamed milk",
                "count": 2,
                "unit": "part"
            },
            {
                "name": "foamed milk",
                "count": 1,
                "unit": "small part"
            },
        ],
        "taste_profile": "Milky",
        "similar_drinks": ["Flat White", "Cappuccino"]
    }
]

mc_questions = [
    {
        "choices": ["Macchiato", "Latte", "Flat White", "Cappuccino"],
        "correct_answer": 0
    },
    {
        "choices": ["Flat White", "Espresso", "Cappuccino", "Latte"],
        "correct_answer": 1
    },
    {
        "choices": ["Latte", "Flat White", "Americano", "Cappuccino"],
        "correct_answer": 2
    },
    {
        "choices": ["Macchiato", "Espresso", "Americano", "Flat White"],
        "correct_answer": 3
    },
    {
        "choices": ["Latte", "Americano", "Macchiato", "Espresso"],
        "correct_answer": 0
    },
    {
        "choices": ["Espresso", "Cappuccino", "Macchiato", "Americano"],
        "correct_answer": 1
    }
]


all_ingredients = ["1 part espresso", "1 part steamed milk",
                "1 small part foamed milk", "1 part foamed milk", "1 part water"]

curr_ingredients = []

curr_quiz_ingredients = []

def normalize_ingredient_list(ingredients):
    return sorted(ingredients, key=lambda x: (x['name'], x['unit'], x['count']))

@app.route('/')
def home():
    return render_template('home.html',drinks=drinks)

@app.route('/learn/<id>')
def learn(id):
    return render_template('learn_item.html', item = drinks[int(id)])

@app.route('/multiple-choice/<id>')
def multiple_choice(id):
    return render_template('multiple_choice.html', item = drinks[int(id)], mc_question=mc_questions[int(id)])

@app.route('/taste-question/<id>')
def taste_question(id):
    return render_template('taste_question.html', item = drinks[int(id)])

@app.route('/make/<id>')
def make(id):
    return render_template('make_item.html', all_ingredients = all_ingredients, curr_ingredients = curr_ingredients, all_drinks = drinks, item = drinks[int(id)])

@app.route('/quiz')
def quiz():
    return render_template('quiz_home.html')

@app.route('/quiz_item')
def quiz_item():
    return render_template('quiz_item.html', all_drinks=drinks)

@app.route('/quiz_report')
def quiz_report():
    score = session.get('score', 0)
    coins = session.get('coins', 0)
    drink_missed = session.get('drink_missed', [])
    return render_template('quiz_report.html', score=score, coins=coins, drink_missed=drink_missed)

@app.route('/quiz_report_data', methods=['POST'])
def quiz_report_data():
    data = request.get_json()
    session['score'] = data['score']
    session['coins'] = data['coins']
    session['drink_missed'] = data.get('drink_missed', [])
    return jsonify(success=True)

@app.context_processor
def inject_drinks():
    return dict(drinks=drinks)

@app.route('/make/save_ingredient', methods=['GET', 'POST'])
def save_ingredient():
    global all_ingredients
    global curr_ingredients

    json_data = request.get_json()   
    
    new_ingredient = json_data["ingredient"] 
    
    curr_ingredients.append(new_ingredient)
    return jsonify(all_ingredients=all_ingredients, curr_ingredients=curr_ingredients)

@app.route('/make/reset_ingredients', methods=['GET', 'POST'])
def reset_ingredients():
    global all_ingredients
    global curr_ingredients

    curr_ingredients = []
    return jsonify(all_ingredients=all_ingredients, curr_ingredients=curr_ingredients)

@app.route('/make/get_curr_ingredients', methods=['GET', 'POST'])
def get_curr_ingredients():
    global all_ingredients
    global curr_ingredients

    return jsonify(all_ingredients=all_ingredients, curr_ingredients=curr_ingredients)

@app.route('/make/submit_ingredients', methods=['GET', 'POST'])
def submit_ingredients():
    global all_ingredients
    global curr_ingredients

    json_data = request.get_json()   
    
    submitted_ingredients = json_data["curr_ingredients"] 
    print(submitted_ingredients)
    index = int(json_data["id"])
    print(index)
    correct_ingredients = drinks[index]["backend_ingredients"]
    print(correct_ingredients)
    res = "Incorrect"
    if Counter(correct_ingredients) == Counter(submitted_ingredients):
        res = "Correct"
    else:
        res = "Incorrect"
    

    return jsonify(all_ingredients=all_ingredients, curr_ingredients=curr_ingredients, res=res)


@app.route('/quiz/deliver', methods=['POST'])
def deliver():
    json_data = request.get_json()
    submitted_ingredients = json_data["ingredients"]
    index = int(json_data["id"])

    correct_ingredients = drinks[index]["ingredients_map"]

    # Flatten the correct ingredients into a list of strings
    correct_list = []
    for item in correct_ingredients:
        name = item["name"]
        count = item["count"]
        unit = item["unit"]

        if unit == "small part":
            correct_list.extend([f"1 small part {name.lower()}"] * count)
        else:
            correct_list.extend([f"1 part {name.lower()}"] * count)

    print("Correct ingredients:", correct_list)
    print("Submitted ingredients:", submitted_ingredients)

    # Compare ingredients using Counter to allow unordered matches
    res = Counter(submitted_ingredients) == Counter(correct_list)
    return jsonify(res=res)

if __name__ == '__main__':
    app.run(debug = True, port=5001)