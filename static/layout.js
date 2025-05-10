document.addEventListener('DOMContentLoaded', function() {

  let recipeModal = document.getElementById('recipeModal');
  
  if (recipeModal) {
    recipeModal.addEventListener('show.bs.modal', function (event) {
      let trigger = event.relatedTarget; 
      let drink = trigger.getAttribute('data-drink-name');
      let recipe = trigger.getAttribute('data-drink-recipe');
      let drinkRecipe = JSON.parse(recipe);

      const modalTitle = recipeModal.querySelector('.modal-title');
      const modalBody = recipeModal.querySelector('#recipeContent');

      modalTitle.textContent = `${drink} Recipe`;
      let ingredientList = drinkRecipe.map(ingredient => {
        return `<li>${ingredient}</li>`;  
            }).join('');
            modalBody.innerHTML = `<ul>${ingredientList}</ul>`;
      
    });

    recipeModal.addEventListener('hidden.bs.modal', function () {
        let element = document.getElementById('maincontainer');
        element.focus();
      });

  }

    $("#home").on("click", function () {
        localStorage.setItem("disableRecipes", "false");
    });

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