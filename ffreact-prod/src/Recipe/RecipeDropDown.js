import React, { useState } from 'react';

function RecipeDropdown() {
  // state to keep track of the selected recipe
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // state to keep track of whether the menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // handle clicks on the menu button
  function handleClick() {
    setIsOpen(!isOpen);
  }

  // handle clicks on a recipe option
  function handleOptionClick(recipe) {
    setSelectedRecipe(recipe);
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={handleClick}>
        {selectedRecipe ? selectedRecipe.name : 'Select a recipe'}
      </button>
      {isOpen && (
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id} onClick={() => handleOptionClick(recipe)}>
              {recipe.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const recipes = [
  { id: 1, name: 'Veggie Lasagna' },
  { id: 2, name: 'Tuna Casserole' },
  { id: 3, name: 'Beef and Bean Enchiladas' },
];

export default RecipeDropdown;
