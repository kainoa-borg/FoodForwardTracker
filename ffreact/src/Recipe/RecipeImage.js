import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";


const RecipeImage = (props) => {
    // console.log(props.image_source);
    // Replace image with a prompt if undefined
    if (props.image_source) {
        return (
            <Box sx={{position: 'relative'}}>
                <Button color='lightBlue' variant='contained' sx={{position: 'absolute', right: '0%'}} onClick={() => props.handleDeleteImageClick('image')}>
                    <HighlightOff/>
                </Button>
                <Box sx={{height: '100%', width: '100%'}}>
                    <iframe style={{maxHeight: '50vh', maxWidth: '30vw'}} src={props.image_source} key={props.image_source}></iframe>
                </Box>
            </Box>                
        );
    }
    else {
        return (<Typography>Enter a recipe image</Typography>)
    }
}

export default RecipeImage