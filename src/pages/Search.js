import React from 'react'
import { NavBar, SearchFilter, SearchResult } from '../components'
import '../assets/scss/searchpage.scss'

const Search = () => {
    return (
        <div className='search-page'>
            <NavBar back design='default' />
            <div className='search-background'>
                <SearchFilter />
                <SearchResult />
            </div>
        </div>
    )
}

export default Search
