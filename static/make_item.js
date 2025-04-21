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
        }
      });
  } );

  