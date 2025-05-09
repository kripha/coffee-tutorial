let score = 0;

document.addEventListener("DOMContentLoaded", function () {
    const characters = ["neutral_man.png", "neutral_woman.png"];
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    const charImg = document.getElementById("character-img");
    if (charImg) {
        charImg.src = "/static/images/characters/" + randomChar;
    }
});

$(function () {
    const allDrinks = window.quizData || [];
    const shuffled = [...allDrinks].sort(() => Math.random() - 0.5);
    let currentIndex = 0;
  
    function showNextPrompt() {
        if (currentIndex >= shuffled.length) {
            $("#speech-bubble").html(`You're done!<br>You scored <strong>${score} out of ${shuffled.length}</strong>.`);
            // TODO: Send coins, score, and drink missed to /quiz_report_data (POST)
            // TODO: Call the function commented below after successfully return from /quiz_report_data
            // window.location.href='/quiz_report'
            $("#main-cup").empty();
            return;
        }
        
        const drink = shuffled[currentIndex];
        $("#speech-bubble").text(`Could you make me a ${drink.name}?`);
        $("#main-cup").empty().append("<p>Drop Here</p>");
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
    
        const currentDrinkId = shuffled[currentIndex].id;
  
        fetch("/quiz/deliver", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            id: currentDrinkId,
            ingredients: userIngredients
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.res) {
                score++;
                alert("Correct!");
            } else {
                alert("Incorrect. Try again.");
            }
            currentIndex++;
            showNextPrompt();
        });
    });
    showNextPrompt();
  });