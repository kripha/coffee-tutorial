$(document).ready(function(){
    display_all_ingredients();
    ingredients_draggable();
    reset_ingredients();
})

// $(function(){
//     $( ".draggable" ).draggable({
//         revert: "invalid"
//     });
//     $(".draggable").hover(function(){
//         $(this).css('cursor','move');
//     });
//     $( "#beaker" ).droppable({
//         over: function(event, ui) {
//             $(this).css('background-color', 'lightblue'); 
//         },
//         out: function(event, ui) {
//             $(this).css('background-color', 'white');
//         },
//         drop: function(event, ui) {
//             $(this).css('background-color', 'white');
//             let droppedEvent = ui.helper[0].innerText;
//             let ingredient = droppedEvent.trim();
//             addIngredient(ingredient);
//             display_all_ingredients();
//         }
//     });
// })

$(function(){
    $('#reset-button').click(function() {
        reset_ingredients();
    });
    $('#submit-button').click(function() {
        let curr_ingredients = get_curr_ingredients();
        submit_ingredients(curr_ingredients);
    });
})

function ingredients_draggable(){
    $( ".draggable" ).draggable({
        revert: "invalid"
    });
    $(".draggable").hover(function(){
        $(this).css('cursor','move');
    });
    $( "#beaker" ).droppable({
        over: function(event, ui) {
            $(this).css('background-color', 'lightblue'); 
        },
        out: function(event, ui) {
            $(this).css('background-color', 'white');
        },
        drop: function(event, ui) {
            $(this).css('background-color', 'white');
            let droppedEvent = ui.helper[0].innerText;
            let ingredient = droppedEvent.trim();
            addIngredient(ingredient);
            display_all_ingredients();
        }
    });
}

function display_all_ingredients(){
    $("#water-container").html("");
    $("#water-container").append('<div class="draggable" id="water">'
     + '<img src="../static/images/ingredients/glass-of-water.png">'
      + '1 part water </div>');
    $("#steamed-milk-container").html("");
    $("#steamed-milk-container").append('<div class="draggable" id="steamed-milk">'
        + '<img id="steamed-milk-img" src="../static/images/ingredients/steamed-milk.png">'
        + '1 steamed milk</div>');
    $("#espresso-container").html("");
    $("#espresso-container").append('<div class="draggable" id="espresso"> <img src="../static/images/ingredients/espresso-shot.png"> 1 part espresso</div>');
    $("#foamed-milk-container").html("");
    $("#foamed-milk-container").append('<div class="draggable" id="foamed-milk">'
      + '<img src="../static/images/ingredients/frothed-milk.png">'
      + '1 part foamed milk</div>');
    $("#small-foamed-milk-container").html("");
    $("#small-foamed-milk-container").append('<div class="draggable" id="small-foamed-milk">'
    + '<img id="small-foamed-milk-img" src="../static/images/ingredients/frothed-milk.png">'
    + '1 small part foamed milk </div>');
    ingredients_draggable();
}

// $(document).ready(function(){
//     display_all_ingredients();
//     display_ingredients(curr_ingredients);
//     reset_ingredients();
// })

// $(function() {
//     $( ".draggable" ).draggable({
//         revert: "invalid"
//     });
//     $(".draggable").hover(function(){
//         $(this).css('cursor','move');
//     });

//     $( "#beaker" ).droppable({
//         over: function(event, ui) {
//             $(this).css('background-color', 'lightyellow'); 
//         },
//         out: function(event, ui) {
//             $(this).css('background-color', 'lightblue');
//         },
//         drop: function(event, ui) {
//             $(this).css('background-color', 'lightblue');
//             let droppedEvent = ui.helper[0].innerText;
//             addIngredient(droppedEvent);
//             display_all_ingredients();
//         }
//       });


//       $('#resetButton').click(function() {
//         reset_ingredients();
//       });

//       $('#submitButton').click(function() {
//         let curr_ingredients = get_curr_ingredients();
//         submit_ingredients(curr_ingredients);
//       });
//   } );

function addIngredient(ingredient){
    let data_to_save = {"ingredient": ingredient}
    $.ajax({
        type: "POST",
        url: "save_ingredient",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data_to_save),
        success: function(result){
            let curr_ingreds = result["curr_ingredients"]
            ingredients = curr_ingreds
            display_ingredients(ingredients)
        },
        error: function(request, status, error){
            console.log("Error saving ingredient");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

function display_ingredients(ingredients){
    if(ingredients.length == 0){
        $("#beaker").html("");
        ingredients_draggable();
    }
    else {
        $("#beaker").html("");
        ingredients_draggable();
        for(let i = 0; i < ingredients.length; i++){
            ingred = ingredients[i];
            let ingred_name = ""
            if(ingred == "1 part espresso"){
                ingred_name = "espresso"
            }
            if(ingred == "1 part water"){
                ingred_name = "water"
            }
            if(ingred == "1 part foamed milk"){
                ingred_name = "foamed-milk"
            }
            if(ingred == "1 small part foamed milk"){
                ingred_name = "small-foamed-milk"
            }
            if(ingred == "1 steamed milk"){
                ingred_name = "steamed-milk"
            }
            $("#beaker").append('<div class="ingred" id="dropped-' + ingred_name + '">' + ingred + '</div>');
        }
    }
    if(ingredients.length >= 6){
        $("#resultdiv").html("Too many ingredients. Either reset or mix.");
        $("#beaker").droppable("disable");
    } else{
        $("#resultdiv").html("");
    }
}



function reset_ingredients(){
    $("#resultdiv").html("");
    $("#beaker").droppable("enable");
    $.ajax({
        type: "GET",
        url: "reset_ingredients",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            let curr_ingreds = result["curr_ingredients"]
            ingredients = curr_ingreds;
            display_ingredients(ingredients);
        },
        error: function(request, status, error){
            console.log("Error resetting ingredients");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

function submit_ingredients(ingredients){
    let path = window.location.pathname;  
    let id = path.split('/').pop();       
    let data_to_save = {"curr_ingredients": ingredients, "id": id}
    $.ajax({
        type: "POST",
        url: "submit_ingredients",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data_to_save),
        success: function(result){
            reset_ingredients();
            let res = result["res"]
            if(res == "Correct"){
                $("#result-div").html("Correct! Proceed to the next page.<br>");
                var button = $('<button/>', {
                    text: 'Next Page', 
                    id: 'myButton', 
                    class: 'my-button-class standard-button', 
                    click: function() { 
                        if(item["id"] == all_drinks.length - 1){
                            let url = "/quiz"
                            window.location.href = url;
                        } else{
                            let next_id = parseInt(item["id"], 10) + 1;
                            let next_string = next_id.toString();
                            let url = "/learn/" + next_string
                            window.location.href = url;
                        }
                    }
                  });
                  $('#result-div').append(button);
                  if(item["id"] == all_drinks.length - 1){
                    $("#myButton").text("Take Quiz");
                  }
            }
            else{
                $("#result-div").html("Incorrect! Try again!")
                $("#beaker").droppable("enable");
            }
        },
        error: function(request, status, error){
            console.log("Error saving ingredient");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

function get_curr_ingredients(){
    $.ajax({
        type: "GET",
        url: "get_curr_ingredients",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            let curr_ingreds = result["curr_ingredients"]
            ingredients = curr_ingreds
        },
        error: function(request, status, error){
            console.log("Error resetting ingredients");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
    return ingredients;
}

  