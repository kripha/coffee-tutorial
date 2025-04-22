$(document).ready(function(){
    display_all_ingredients();
})

$(function() {
    $( ".draggable" ).draggable({
        revert: "invalid"
    });
    $(".draggable").hover(function(){
        $(this).css('cursor','move');
    });

    $( ".droppable" ).droppable({
        over: function(event, ui) {
            $(this).css('background-color', 'lightyellow'); 
        },
        out: function(event, ui) {
            $(this).css('background-color', 'lightblue');
        },
        drop: function(event, ui) {
            $(this).css('background-color', 'lightblue');
            let droppedEvent = ui.helper[0].innerText;
            addIngredient(droppedEvent);
            display_all_ingredients();
        }
      });


      $('#resetButton').click(function() {
        reset_ingredients();
      });
  } );

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
        $("#drop-container").html("Drop here");
    }
    else {
        $("#drop-container").html("");
        for(let i = 0; i < ingredients.length; i++){
            ingred = ingredients[i];
            $("#drop-container").append(ingred);
            $("#drop-container").append("<br>");
        }
    }
}

function display_all_ingredients(){
    $("#drag-container").html("");
    for(let i = 0; i < all_ingredients.length; i++){
        $("#drag-container").append("<div class='draggable' id='ingred-" + i + "'>" + all_ingredients[i] + "</div>");
    }
    $(".draggable").draggable({
        revert: "invalid"
    });
    $(".draggable").hover(function(){
        $(this).css('cursor','move');
    });
}

function reset_ingredients(){
    $.ajax({
        type: "GET",
        url: "reset_ingredients",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            let curr_ingreds = result["curr_ingredients"]
            ingredients = curr_ingreds
            display_ingredients(ingredients)
        },
        error: function(request, status, error){
            console.log("Error resetting ingredients");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    })
}

  