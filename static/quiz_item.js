let score = 0;
let characterBase = "";

document.addEventListener("DOMContentLoaded", function () {
    const characters = [
        "happy_man.png", "happy_woman.png", "mad_man.png", "mad_woman.png",
        "neutral_man.png", "neutral_woman.png"
    ];
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    characterBase = randomChar.includes("man") ? "man" : "woman";
    const charImg = document.getElementById("character-img");
    if (charImg) {
        charImg.src = "/static/images/characters/neutral_" + characterBase + ".png";
    }
});

$(function () {
    const allDrinks = window.quizData || [];
    // Shuffle and create initial drink-specific prompts
    const drinkPrompts = [...allDrinks].map(drink => ({
        type: "specific",
        drink: drink,
    }));
    
    // Create taste profile prompts
    const tasteProfilePrompts = [
        { type: "taste_profile", target_profile: "Milky" },
        { type: "taste_profile", target_profile: "Bitter" }
    ];
    
    // Randomly insert taste profile prompts into the shuffled array
    const insertionPoints = [2, 5]; // adjust as desired
    insertionPoints.forEach((pos, i) => {
        drinkPrompts.splice(pos, 0, tasteProfilePrompts[i]);
    });
    
    const shuffled = drinkPrompts;
    let currentIndex = 0;
  
    function showNextPrompt() {
        if (currentIndex >= shuffled.length) {
            const missed = shuffled
            .filter(d => d.correct === false)
            .map(d => d.type === "specific" ? d.drink.name : `any ${d.target_profile.toLowerCase()} drink`);
      
            fetch("/quiz_report_data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                score: score,
                coins: score * 20,
                drink_missed: missed
                })
            }).then(res => {
                if (res.ok) {
                    window.location.href = "/quiz_report";
                } else {
                    console.error("Failed to submit report");
                }
            });
        
            return;
        }
        
        const prompt = shuffled[currentIndex];
        
        if (prompt.type === "specific") {
            $("#speech-bubble").text(`Could you make me a ${prompt.drink.name}?`);
        } else {
            $("#speech-bubble").text(`Could you make me a ${prompt.target_profile.toLowerCase()} drink?`);
        }
        
        $("#main-cup").empty().append("<p>Drop Here</p>");
    }

    function showFeedback(correct, callback) {
        const charImg = $("#character-img");
        const speech = $("#speech-bubble");
      
        if (correct) {
            charImg.attr("src", `/static/images/characters/happy_${characterBase}.png`);
            speech.text("Thanks!");
        } else {
            charImg.attr("src", `/static/images/characters/mad_${characterBase}.png`);
            speech.text("That’s not right...");
        }
      
        setTimeout(() => {
            charImg.attr("src", `/static/images/characters/neutral_${characterBase}.png`);
            callback(); // showNextPrompt()
        }, 3000);
    }
  
    $(".draggable").draggable({
        revert: "invalid",
        helper: "clone",
        appendTo: "body",
        containment: "window"
    });

    // Frother: milk -> frothed milk
    $("#frother").droppable({
        accept: "#milk-cup",
        drop: function (event, ui) {
        const milkContainer = $("#milk-cup");
        const newCup = $("<img>")
            .attr("src", "/static/images/ingredients/frothed-milk.png")
            .attr("data-ingredient", "Foamed milk")
            .attr("id", "milk-cup")
            .addClass("ingredient-img draggable");
    
        milkContainer.replaceWith(newCup);
        newCup.draggable({ revert: "invalid", helper: "clone", appendTo: "body" });
        }
    });
    
    // Steamer: milk -> steamed milk
    $("#steamer").droppable({
        accept: "#milk-cup",
        drop: function (event, ui) {
        const milkContainer = $("#milk-cup");
        const newCup = $("<img>")
            .attr("src", "/static/images/ingredients/steamed-milk.png")
            .attr("data-ingredient", "Steamed milk")
            .attr("id", "milk-cup")
            .addClass("ingredient-img draggable");
    
        milkContainer.replaceWith(newCup);
        newCup.draggable({ revert: "invalid", helper: "clone", appendTo: "body" });
        }
    });
  
    $("#main-cup").droppable({
        drop: function (event, ui) {
            let ingredient = ui.draggable.data("ingredient");
            let displayName = ingredient;
        
            // If dropping frothed or steamed milk, revert tray to plain milk
            if (ingredient === "Foamed milk" || ingredient === "Steamed milk") {
                const newMilkCup = $("<img>")
                .attr("src", "/static/images/ingredients/milk.png")
                .attr("data-ingredient", "Milk")
                .attr("id", "milk-cup")
                .addClass("ingredient-img draggable");
        
                $("#milk-cup").replaceWith(newMilkCup);
                newMilkCup.draggable({ revert: "invalid", helper: "clone", appendTo: "body" });
            }
        
            // Apply unit logic to all milk types
            if (ingredient === "Milk" || ingredient === "Foamed milk" || ingredient === "Steamed milk") {
                const milkUnit = $("#milk-unit").val();
                if (milkUnit === "part") {
                displayName = ingredient;
                } else {
                displayName = `A ${milkUnit} of ${ingredient.toLowerCase()}`;
                }
            }
        
            const div = $("<div>").text(displayName).css({
                "font-size": "14px",
                "margin": "2px"
            });
        
            $(this).append(div);
        }
    });
  
    $("#dump-button").click(function () {
        $("#main-cup").empty().append("<p>Drop Here</p>");
    });

    $("#submit-button").click(function () {
        const userIngredients = [];
      
        $("#main-cup").children("div").each(function () {
          userIngredients.push($(this).text().trim());
        });
      
        const currentPrompt = shuffled[currentIndex];
      
        // Determine list of correct drink IDs to validate against
        let validDrinkIds = [];
      
        if (currentPrompt.type === "specific") {
            validDrinkIds = [currentPrompt.drink.id];
        } else if (currentPrompt.type === "taste_profile") {
            validDrinkIds = allDrinks
            .filter(d => d.taste_profile === currentPrompt.target_profile)
            .map(d => d.id);
        }
      
        // Helper: try matching userIngredients against multiple drinks
        let validated = false;
        let validationIndex = 0;
      
        function tryNextDrink() {
            if (validationIndex >= validDrinkIds.length) {
                    currentPrompt.correct = false;
                    showFeedback(false, () => {
                    currentIndex++;
                    showNextPrompt();
                });
                return;
            }
        
            const testId = validDrinkIds[validationIndex];
            validationIndex++;
        
            fetch("/quiz/deliver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    id: testId,
                    ingredients: userIngredients
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.res) {
                    score++;
                    currentPrompt.correct = true;
                    showFeedback(true, () => {
                        currentIndex++;
                        showNextPrompt();
                    });
                } else {
                    tryNextDrink(); // try next possible match
                }
            });
        }
      
        tryNextDrink();
    });
});