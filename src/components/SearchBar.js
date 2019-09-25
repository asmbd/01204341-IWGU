import React, { Component } from 'react'
import './../assets/scss/searchbar.scss'
import SearchIcon from '../assets/icon/search-icon.svg'
import { withRouter } from 'react-router-dom'

const tags = ['coffee shop', 'street food', 'folk villages', 'landmark', 'souvenir shop', 'park',]
// const tags =[]
class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search_word: "",
            show: false,
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside)
    }

    setWrapperRef = node => this.wrapperRef = node

    handleClickOutside = event => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ show: false })
        }
    }

    showSearch = () => this.setState({ show: true })

    handleChange = event => {
        let word = event.target.value
        // console.log(word)
        let show = word.length !== 0 ? true : false
        // console.log(show)
        this.setState({
            search_word: word
            , show
        })
    }

    searchArea() {
        if (this.state.show) {
            return (
                <div className='search-box open' ref={this.setWrapperRef}>
                    <div className='search-area'>
                        <div className='search-category'>
                            <span>Popular category</span>
                            <div className='search-tag'>{this.genTag()}</div>
                        </div>
                        <div className='search-history'>Search History</div>
                    </div>
                </div>
            )
        }
        return (<div className='search-box' />)
    }

    genTag = () => tags.map((tag, i) => <div className="tag" key={`tag ${i}`}>{tag}</div>)

    swapPage = e => {
        if (e.target.value !== "" && e.charCode == 13) {
            this.props.history.push(`/search`)
        }
    }

    render() {
        return (
            <div className='search'>
                <div className='input'>
                    <img src={SearchIcon} />
                    <input placeholder='Search' onChange={this.handleChange} onClick={this.showSearch} value={this.state.search_word} onKeyPress={this.swapPage} />
                </div>
                {this.searchArea()}
            </div>
        )
    }
}
export default withRouter(SearchBar)
