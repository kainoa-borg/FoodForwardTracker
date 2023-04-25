import CostTotals from './Reports/CostTotals.js'
import EntryPage from './components/EntryPage.js'
import LoginPage from './components/LoginPage.js'
import LandingPage from './components/LandingPage.js'
import MealsPage from './Meals/MealsPage.js'
import InventoryPage from './InventoryPage.js'
import HouseholdForm from './Households/HouseholdForm.js'
import HouseholdPage from './Households/HouseholdPage.js'
import HouseholdsReport from './Reports/HouseholdsReport.js'
import Ingredients from './Ingredients/IngredientList.js'
import IngredientPage from './Ingredients/IngredientPage.js'
import IngredientsReport from './Reports/IngredientsReport.js'
import IngPurchaseReport from './Reports/IngPurchaseReport.js'
import StationList from './Stations/StationList.js'
import ReportsPage from "./Reports/ReportsPage.js"
import UserPage from "./User/UserPage.js"
import UserList from "./User/UserList.js"
import NewUserPage from "./User/NewUserPage.js"
import MealPlan from './Meals/MealList.js'
import MealPlanReport from './Reports/MealPlanReport.js'
import MealHistoryReport from './Reports/MealHistoryReport.js'
import Packaging from './Packaging/PackagingList.js'
import PackagingPage from './Packaging/PackagingPage.js'
import PackagingReport from './Reports/PackagingReport.js'
import PackagingReturns from './Reports/PackagingReturns.js'
import PackagingPurchaseReport from './Reports/PackagingPurchaseReport.js'
import PwResetPage from './components/PwResetPage.js'
import Recipe from './Recipe/RecipeList.js'
import RecipePage from './Recipe/RecipePage.js'
import UnderConstruction from './components/UnderConstruction.js'
import Navbar from './components/Navbar.js'
import React from 'react'
import { Routes, Route, Navigate, useNavigate, createSearchParams, HashRouter } from 'react-router-dom'
import { useState } from 'react'
import { Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
// import { useOutsideClick} from './components/Dropdown'
import './App.css';

// SERVER IP 4.236.185.213

const style = {
    padding: '10px',
    // border: '1px solid black',
    display: 'flex',
    justifyContent: 'space-between',
};

const App = () => {
    return (
        <HashRouter>
            <AppComponent/>
        </HashRouter>
    )
}

const AppComponent = () => {
    const navigate = useNavigate();
    const [loginState, setLoginState] = useState({
        username: "",
        isAuthenticated: false,
        isAdmin: false
    })

    // const handleClickOutside = () => {};
    // const ref = useOutsideClick(handleClickOutside);
    
    const handleHeaderClick = (event) => {
        event.stopPropagation();
      };

    /*const readLoginCookie = () => {
        const parseCookie = str =>
            str
            .split(';')
            .map(v => v.split('='))
            .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
        return parseCookie(document.cookie);
    }*/

    const handleLogout = () => {
        document.cookie = 'username=;'
        document.cookie = 'isAuthenticated=false;'
        document.cookie = 'isAdmin=false;'
        setLoginState({
            username: '',
            isAuthenticated: false,
            isAdmin: false
        })
    }

    const handlePageClick = (pageName) => {
        console.log(pageName)
        switch(pageName) {
            case 'cost-totals': navigate('cost-totals-report'); break;
            case 'loginPage': navigate('/login'); break;
            case 'newUserPage': navigate('/sign-up'); break;
            case 'pwResetPage': navigate('/reset-password'); break;
            case 'landingPage': navigate('/home'); break;
            case 'mealsPage': setCurrPage(<MealsPage handlePageClick={handlePageClick} />); break;
            case 'households': navigate('/clients'); break;
            case 'householdForm': setCurrPage(<HouseholdForm />); break;
            case 'households-report': navigate('clients-report'); break;
            case 'ingredientPage': navigate('/ingredients'); break;
            case 'ingredients-report': navigate('ingredients-report'); break;
            case 'ing-purchase-report': navigate('ingredient-purchasing-report'); break;
            case 'inventoryPage': setCurrPage(<InventoryPage handlePageClick={handlePageClick} />); break;
            case 'packagingPage': navigate('/packaging'); break;
            case 'packaging-report': navigate('/packaging-report'); break;
            case 'packaging-return-report': navigate('package-return-report'); break;
            case 'pack-purchase-report': navigate('package-purchasing-report'); break;
            case 'stations': setCurrPage(<StationList handlePageClick={handlePageClick} />); break;
            case 'meals': navigate('/mealplans'); break;
            case 'meal-plan-report': navigate('/meal-plan-report'); break;
            case 'meal-history-report': navigate('/meal-history-report'); break;
            case 'recipes': setCurrPage(<Recipe handlePageClick={handlePageClick} />); break;
            case 'recipePage': navigate('/recipes'); break;
            case 'reports': setCurrPage(<ReportsPage handlePageClick={handlePageClick} />); break;
            case 'userPage': setCurrPage(<UserPage handlePageClick={handlePageClick} />); break;
            case 'userList': navigate('/admin'); break;
            case 'entryPage': navigate('/'); break;
            case 'under-construction': setCurrPage(<UnderConstruction handlePageClick={handlePageClick}/>); break;
            default: setCurrPage(<LandingPage handlePageClick={handlePageClick} />); break;
        }
    }

    const [currPage, setCurrPage] = useState(<EntryPage handlePageClick={handlePageClick} setLoginState={setLoginState} />);

    // useEffect(() => {setCurrPage(<EntryPage handlePageClick={handlePageClick}/>)}, [])
    // Charcoal: #898989
    // Ultraviolet: #5A5874

    const ProtectedRoute = ({ isAdmin, children }) => {
        const params = {isAdmin: isAdmin};
        if (!isAdmin) {
          return navigate({pathname: "/home", search: `?${createSearchParams(params)}`});
        }
      
        return children;
    };

    const theme = createTheme({
        palette: {
            lightGreen: {
                main: '#9AB847', // light green logo color
                contrastText: '#fff'
            },
            darkGreen: {
                main: '#636182',
                contrastText: '#fff'
            },
            lightBlue: {
                main: '#636182',
                contrastText: '#fff'
            },
            lightOrange: {
                main: '#636182',
                contrastText: '#fff'
            },
            darkBlue: {
                // main: '#404851',
                main: '#636182',
                contrastText: '#fff'
            },
        }
    })

    return (
        <ThemeProvider theme={theme}>
        <div className="App" style={style} onClick={handleHeaderClick}>
            <Navbar handlePageClick={handlePageClick} handleLogout={handleLogout} loginState={loginState} />
            <Box sx={{
                bgcolor: (theme) => theme.palette.background.default,
                minHeight: "100%",
                width: '90%',
                margin: 'auto',
                marginTop: {lg: '5%', md: '6%', sm: '10%', xs: '12%'},
            }}>
                <Routes>
                    <Route exact path='/' element={<EntryPage setLoginState={setLoginState} handlePageClick={handlePageClick}/>}/>
                    <Route path='/home' element={<LandingPage handlePageClick={handlePageClick} />}/>
                    <Route path='/login' element={<LoginPage loginState={loginState} setLoginState={setLoginState} handlePageClick={handlePageClick} />}/>
                    <Route path='/sign-up' element={<NewUserPage handlePageClick={handlePageClick} />}/>
                    <Route path='/reset-password' element={<PwResetPage handlePageClick={handlePageClick} />}/>
                    <Route path='/clients' element={<HouseholdPage handlePageClick={handlePageClick} />}/>
                    <Route path='/ingredients' element={<IngredientPage handlePageClick={handlePageClick} />}/>
                    <Route path='/packaging' element={<PackagingPage handlePageClick={handlePageClick} />}/>
                    <Route path='/mealplans' element={<MealPlan handlePageClick={handlePageClick} />}/>
                    <Route path='/recipes/*' element={<RecipePage handlePageClick={handlePageClick} setCurrPage={setCurrPage} />}/>
                    <Route path='/cost-totals-report' element={<CostTotals handlePageClick={handlePageClick} />}/>
                    <Route path='/clients-report' element={<HouseholdsReport handlePageClick={handlePageClick} />}/>
                    <Route path='/ingredients-report' element={<IngredientsReport handlePageClick={handlePageClick} />}/>
                    <Route path='/ingredient-purchasing-report' element={<IngPurchaseReport handlePageClick={handlePageClick} />}/>
                    <Route path='/meal-plan-report' element={<MealPlanReport handlePageClick={handlePageClick} />}/>
                    <Route path='/meal-history-report' element={<MealHistoryReport handlePageClick={handlePageClick} />}/>
                    <Route path='/packaging-report' element={<PackagingReport handlePageClick={handlePageClick} />}/>
                    <Route path='/package-purchasing-report' element={<PackagingPurchaseReport handlePageClick={handlePageClick} />}/>
                    <Route path='/package-return-report' element={<PackagingReturns handlePageClick={handlePageClick} />}/>
                    <Route path='/under-construction' element={<UnderConstruction handlePageClick={handlePageClick}/>}/>
                    <Route path='/admin' element={
                        <ProtectedRoute isAdmin={!!loginState && loginState.isAdmin}>
                            <UserList handlePageClick={handlePageClick}/>
                        </ProtectedRoute>}>
                    </Route>
                    <Route path='/user-page' element={<UserPage handlePageClick={handlePageClick} />}/>
                </Routes>
            </Box>
        </div>
        </ThemeProvider>
    );
};

export default App;
