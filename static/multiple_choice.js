mc_answers = [0, 1, 2, 3, 0, 1]

$(document).ready(function(){

    console.log(mc_answers[3])
    $('.mc-button').click(function() {
        $("#feedback").empty()
        $("#next-button-col").empty()
        $('.mc-button').removeClass("highlight")
        $(this).addClass("highlight")

        // get drink number we are on
        drink_num = parseInt($(location).attr('href').slice(-1))

        // get the id of mc button
        mc_id = parseInt((this.id))
        console.log(mc_id)

        // compare with correct answer
        if (mc_id == mc_answers[drink_num] ) {
            $('#feedback').html("Correct!")
            $('#next-button-col').append('<a href="/make/'+ drink_num + '"><button id="next-button">Next</button></a>')
        } else {
            $('#feedback').html("Incorrect! Try Again.")
        }

    });

})