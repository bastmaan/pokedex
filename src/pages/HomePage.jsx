import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Box, Typography } from '@mui/material'

const HomePage = () => {
    return (
        <Box>
            <Typography variant="h1">Home Page</Typography>
            <Button>
                <Link to="/pokemonpage">Pokemon Page</Link>
            </Button>
        </Box>
    )
}

export default HomePage