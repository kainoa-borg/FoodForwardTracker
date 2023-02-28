import React, { useState } from 'react'
import { Button } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import Packaging from './Packaging/PackagingList.js'
import PackagingPage from './Packaging/PackagingPage.js'
import Ingredients from './Ingredients/IngredientList.js'
import IngredientPage from './Ingredients/IngredientPage.js'
import Dropdown from './components/Dropdown'


const style = {
    padding: '10px',
    // border: '1px solid black',
    display: 'flex-box',
    justifyContent: 'space-between',
};

const theme = createTheme({
    palette: {
        lightGreen: {
            main: '#9AB847', // light green logo color
            contrastText: '#fff'
        },
        darkGreen: {
            main: '#093B31',
            contrastText: '#fff'
        },
        lightBlue: {
            main: '#3E8477',
            contrastText: '#fff'
        },
        lightOrange: {
            main: '#A35426',
            contrastText: '#fff'
        },
        darkBlue: {
            main: '#070D3A',
            contrastText: '#fff'
        }
    }
})

const InventoryPage = (props) => {
    const [currPage, setCurrPage] = useState();
    const handlePageClick = (pageName) => {
        console.log(pageName)
        switch(pageName) {
            case 'ingredients': setCurrPage(<Ingredients handlePageClick={handlePageClick} />); break;
            case 'packaging': setCurrPage(<Packaging handlePageClick={handlePageClick} />); break;
            case 'packagingPage': setCurrPage(<PackagingPage></PackagingPage>); break;
            case 'ingredientPage': setCurrPage(<IngredientPage></IngredientPage>); break;
            default : break;
        }
    } 
    return (
        <ThemeProvider theme={theme}>
        <div style={style}>
        <CssBaseline />
        <Dropdown
            trigger={<Button color='lightGreen' variant='contained'>Inventory Page</Button>}
            menu={[
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('ingredientPage')}>
                    Ingredients</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('packagingPage')}>
                    Packaging</button>,
                ]}/>
            {currPage}
        </div>
        </ThemeProvider>
    );   
}

export default InventoryPage;