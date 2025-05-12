$(document).ready(function(){

    $('.mc-button').click(function() {
        $("#feedback").empty()
        $("#next-button-col").empty()
        $('.mc-button').removeClass("highlight")
        $(this).addClass("highlight")

        // get drink number we are on
        drink_num = parseInt($(location).attr('href').slice(-1))

        // get the id of mc
        if (drink_num < 3) {
            correct = "bitter-button"
        } else {
            correct = "milky-button"
        }
        // compare with correct answer
        if ($(this).attr('id') == correct ) {
            $('#feedback').html("Correct!")
            $('#next-button-col').append('<a href="/multiple-choice/'+ drink_num + '"><button id="next-button">Next</button></a>')
        } else {
            $('#feedback').html("Incorrect! Try Again.")
        }

    });

})