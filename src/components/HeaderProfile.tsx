import React from 'react'
import '../styles/HeaderProfile.scss'
import Box from './Box'

function HeaderProfile() {
    return (
        <Box className='header-profile !backdrop-blur-none p-5 !bg-secondary/0'>
            <Box className='aspect-square !rounded-full max-w-xs self-center profile-container'>
                <div className="profile aspect-square w-full rounded-full"></div>
            </Box>
        </Box>
    )
}

export default HeaderProfile