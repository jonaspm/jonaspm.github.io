
import React from 'react'
import HeaderResume from './HeaderResume'
import HeaderProfile from './HeaderProfile'
import '../styles/Header.scss'

function Header () {
    return (
        <div className="header max-w-7xl justify-center mt-5">
            <HeaderResume />
            <HeaderProfile/>
        </div>
    )
}

export default Header