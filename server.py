from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from collections import Counter
app = Flask(__name__)

drinks = [
    {
        "id": 0,
        "name": "Espresso",
        "img": "../static/images/espresso.png",
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
        "name": "Latte",
        "img": "../static/images/latte.png",
        # TODO: should it be 2 parts of 1 part, 1 part?
        "ingredients": ["1 part espresso", "2 parts steamed milk", "A thin layer of foamed milk"],
        "backend_ingredients": ["1 part espresso", "1 part steamed milk", "1 part steamed milk", "A thin layer of foamed milk"],
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
                "unit": "thin layer"
            },
        ],
        "taste_profile": "Milky",
        "similar_drinks": ["Flat White", "Cappuccino"]
    },
    
    {
        "id": 2,
        "name": "Cappuccino",
        "img": "../static/images/cappuccino.png",
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
        "id": 3,
        "name": "Americano",
        "img": "../static/images/americano.png",
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
        "id": 4,
        "name": "Flat White",
        "img": "../static/images/flat_white.png",
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
        "name": "Macchiato",
        "img": "../static/images/macchiato.png",
        "ingredients": ["2 parts espresso", "A splash of steamed milk"],
        "backend_ingredients": ["1 part espresso", "1 part espresso", "A splash of steamed milk"],
        "ingredients_map" : [
            {
                "name": "espresso",
                "count": 2,
                "unit": "part"
            },
            {
                "name": "steamed milk",
                "count": 1,
                "unit": "splash"
            }
        ],
        "taste_profile": "Bitter",
        "similar_drinks": ["Espresso", "Americano"]
    }
]

# all_ingredients = ["1 part espresso", "2 parts espresso", "A splash of steamed milk", "1 part steamed milk",  
#                 "2 parts steamed milk", "A thin layer of foamed milk", "1 part foamed milk", "2 parts water"]

all_ingredients = ["1 part espresso", "A splash of steamed milk", "1 part steamed milk",  
                 "A thin layer of foamed milk", "1 part foamed milk", "1 part water"]

curr_ingredients = []

@app.route('/')
def home():
    return render_template('home.html',drinks=drinks)

@app.route('/learn/<id>')
def learn(id):
    return render_template('learn_item.html', item = drinks[int(id)])

@app.route('/make/<id>')
def make(id):
    return render_template('make_item.html', all_ingredients = all_ingredients, curr_ingredients = curr_ingredients, all_drinks = drinks, item = drinks[int(id)])

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
    index = int(json_data["id"])
    correct_ingredients = drinks[index]["backend_ingredients"]
    res = "Incorrect"
    if Counter(correct_ingredients) == Counter(submitted_ingredients):
        res = "Correct"
    else:
        res = "Incorrect"
    

    return jsonify(all_ingredients=all_ingredients, curr_ingredients=curr_ingredients, res=res)

if __name__ == '__main__':
    app.run(debug = True, port=5001)