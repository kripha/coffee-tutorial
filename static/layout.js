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
});