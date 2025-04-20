from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

drinks = [
    { "id": 0,
    "name": "Espresso",
    "img": "../static/images/espresso.png",
    "ingredients": ["1 part espresso"],
    "taste_profile": "Bitter",
    "similar_drinks": ["Macchiato", "Americano"]
    },
    
    { "id": 1,
    "name": "Latte",
    "img": "../static/images/latte.png",
    # TODO: should it be 2 parts of 1 part, 1 part?
    "ingredients": ["1 part espresso", "2 parts steamed milk", "A thin layer of foamed milk"],
    "taste_profile": "Milky",
    "similar_drinks": ["Flat White", "Cappuccino"]
    },
    
    { "id": 2,
    "name": "Cappuccino",
    "img": "../static/images/cappuccino.png",
    "ingredients": ["1 part espresso", "1 part steamed milk", "1 part foamed milk"],
    "taste_profile": "Milky",
    "similar_drinks": ["Flat White", "Latte"]
    },

    { "id": 3,
    "name": "Americano",
    "img": "../static/images/americano.png",
    "ingredients": ["1 part espresso", "2 parts water"],
    "taste_profile": "Bitter",
    "similar_drinks": ["Espresso", "Macchiato"]
    },

    { "id": 4,
    "name": "Flat White",
    "img": "../static/images/flat_white.png",
    "ingredients": ["1 part espresso", "2 parts steamed milk"],
    "taste_profile": "Milky",
    "similar_drinks": ["Latte", "Cappuccino"]
    },

    { "id": 5,
    "name": "Macchiato",
    "img": "../static/images/macchiato.png",
    "ingredients": ["2 parts espresso", "A splash of steamed milk"],
    "taste_profile": "Bitter",
    "similar_drinks": ["Espresso", "Americano"]
    }
]

all_ingredients = ["1 part espresso", "2 parts espresso", "A splash of steamed milk", "1 part steamed milk",  
                "2 parts steamed milk", "A thin layer of foamed milk", "1 part foamed milk", "2 parts water"]

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<id>')
def learn(id):
    return render_template('learn_item.html', item = drinks[int(id)-1])

@app.route('/make/<id>')
def make(id):
    return render_template('make_item.html', all_ingredients = all_ingredients, item = drinks[int(id)-1])

if __name__ == '__main__':
    app.run(debug = True, port=5001)