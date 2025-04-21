// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {

  let recipeModal = document.getElementById('recipeModal');
  
  // Check if the modal exists before adding the event listener
  if (recipeModal) {
    recipeModal.addEventListener('show.bs.modal', function (event) {
      let trigger = event.relatedTarget; // Button that triggered the modal
      let drink = trigger.getAttribute('data-drink-name'); // Get drink name
      let recipe = trigger.getAttribute('data-drink-recipe');
      let drinkRecipe = JSON.parse(recipe);

      const modalTitle = recipeModal.querySelector('.modal-title');
      const modalBody = recipeModal.querySelector('#recipeContent');

      modalTitle.textContent = `${drink} Recipe`;
      let ingredientList = drinkRecipe.map(ingredient => {
        return `<li>${ingredient}</li>`;  // Create a <li> for each ingredient
            }).join('');
            modalBody.innerHTML = `<ul>${ingredientList}</ul>`;
    });
  }
});