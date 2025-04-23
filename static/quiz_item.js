let score = 0;

$(function () {
    const allDrinks = window.quizData || [];
    const shuffled = [...allDrinks].sort(() => Math.random() - 0.5);
    let currentIndex = 0;
  
    function showNextPrompt() {
        if (currentIndex >= shuffled.length) {
            $("#speech-bubble").html(`You're done!<br>You scored <strong>${score} out of ${shuffled.length}</strong>.`);
            $("#main-cup").empty();
            return;
        }
        
        const drink = shuffled[currentIndex];
        $("#speech-bubble").text(`Make a ${drink.name}`);
        $("#main-cup").empty().append("<p>Drop Here</p>");
    }
  
    $(".draggable").draggable({
        revert: "invalid",
        helper: "clone"
    });
  
    $("#main-cup").droppable({
        drop: function (event, ui) {
            let ingredient;
      
            if (ui.draggable.attr("id") === "milk-cup") {
                const milkType = $("#milk-type").val();
                const milkUnit = $("#milk-unit").val();
      
                // Format based on unit
                if (milkUnit === "part") {
                    ingredient = milkType.charAt(0).toUpperCase() + milkType.slice(1); // e.g. "Steamed milk"
                } else {
                    ingredient = `A ${milkUnit} of ${milkType}`;
                }
            } else {
                ingredient = ui.draggable.data("ingredient");
            }
      
            const div = $("<div>").text(ingredient).css({
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