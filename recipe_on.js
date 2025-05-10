$(document).ready(function () {
    if (localStorage.getItem("disableRecipes") === "true") {
        disableRecipeDropdown();
    } else {
        enableRecipeDropdown();
    }

    function disableRecipeDropdown() {
        $("#recipeDropdown").addClass("disabled")
            .css("pointer-events", "none")
            .css("opacity", "0.5")
            .attr("aria-disabled", "true");
    }

    function enableRecipeDropdown() {
        $("#recipeDropdown").removeClass("disabled")
            .css("pointer-events", "")
            .css("opacity", "")
            .attr("aria-disabled", "false");
    }
});