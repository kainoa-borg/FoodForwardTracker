import HouseholdForm from './Households/HouseholdForm.js'
import LoginPage from './LoginPage.js'
import HouseholdList from './Households/HouseholdList.js'
import HouseholdsReport from './Households/HouseholdsReport.js'
import AllergiesList from './Households/AllergiesList.js'
import Ingredients from './Ingredients/IngredientList.js'
import Packaging from './Packaging/PackagingList.js'
import React from 'react'
import {useState} from 'react'

const App = () => {
  const [currPage, setCurrPage] = useState();

  const handlePageClick = (pageName) => {
    console.log(pageName)
    if (pageName === 'householdForm') setCurrPage(<HouseholdForm/>);
    else if (pageName === 'loginPage') setCurrPage(<LoginPage handlePageClick={handlePageClick}/>);
    else if (pageName === 'households') setCurrPage(<HouseholdList/>);
    else if (pageName === 'households-report') setCurrPage(<HouseholdsReport/>);
    else if (pageName === 'ingredients') setCurrPage(<Ingredients/>);
    else if (pageName === 'packaging') setCurrPage(<Packaging/>);
    else if (pageName === 'landing') setCurrPage(<HouseholdList/>);
    else if (pageName === 'allergies') setCurrPage(<AllergiesList allergies={[{aType: 'Gluten'}, {aType: 'Peanut'}]}/>);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Food Forward Tracker</h1>
        {/* <button onClick={() => handlePageClick('householdForm')}>
          Household Form
        </button> */}
        <button onClick={() => handlePageClick('loginPage')}>
          Login Page
        </button>
        <button onClick={() => handlePageClick('households')}>
          Households
        </button>
        <button onClick={() => handlePageClick('households-report')}>
          Households Report
        </button>
        <button onClick={() => handlePageClick('ingredients')}>
          Ingredients
        </button>
        <button onClick={() => handlePageClick('packaging')}>
          Packaging
        </button>
        {currPage}
      </header>
    </div>
  );
}

export default App;