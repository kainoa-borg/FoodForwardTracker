import { Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import RecipeImage from './RecipeImage'

function ImagePreview() {
  const [file, setFile] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)

  useEffect(() => {
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setPreviewURL(reader.result)
    }

    reader.readAsDataURL(file)
  }, [file])

  return (
    <Button color='lightBlue' variant='contained' component='label'>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} hidden />
      <RecipeImage image_source={previewURL} handleDeleteImageClick={() => {setPreviewURL()}}/>
    </Button>
  )
}

export default ImagePreview