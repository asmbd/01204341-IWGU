import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { GoogleApiWrapper } from 'google-maps-react'
import { searchPlace } from '../queries/place'
import { NoResult } from './Icon'
import '../assets/scss/searchresult.scss'

class SearchResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userLocation: {
                latitude: 32,
                longitude: 32,
            },
            loading: true,
        }
    }

    componentDidMount() {
        const search = new URLSearchParams(this.props.location.search)
        const keyword = search.get('q')
        this.props.search.refetch({ keyword })
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords

                this.setState({
                    userLocation: { latitude, longitude },
                    loading: false,
                })
            },
            () => {
                this.setState({ loading: false })
            }
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.search !== this.props.location.search) {
            const search = new URLSearchParams(this.props.location.search)
            const keyword = search.get('q')
            let filters
            if (search.has('time')) {
                filters = {
                    time: search.get('time').split(' '),
                    sortby: search.get('sortby'),
                    rate: search.get('rate').split(' '),
                }
                if (search.has('tag'))
                    filters.tags = search.get('tags').split(' ')
            }
            this.props.search.refetch({ keyword })
        }
    }

    noneResult = () => {
        return (
            <div className='none-result'>
                <img src={NoResult} alt='none-result' />
                <div className='msg-title'>No result found</div>
                <div className='msg-alert'>
                    We can&rsquo;t find any items
                    <br />
                    matching your search
                </div>
            </div>
        )
    }

    render() {
        console.log(
            'loading: ',
            this.state.loading,
            ' location: ',
            this.state.userLocation
        )
        if (this.props.search.loading)
            return <div className='search-result'>Loading</div>
        if (this.props.search.error !== undefined)
            return <div className='search-result'>{this.noneResult()}</div>
        return <div className='search-result'>Search Result</div>
    }
}

export default compose(
    withRouter,
    GoogleApiWrapper({
        apiKey: process.env.MAP_KEY,
    }),
    graphql(searchPlace, { name: 'search' })
)(SearchResult)
