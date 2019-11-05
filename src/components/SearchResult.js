import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { GoogleApiWrapper } from 'google-maps-react'
import '../assets/scss/searchresult.scss'
import { PlannersAction } from '../action'
import { Time, PinkLocationIcon, Star, NoResult, Add, Fav } from './Icon'
import { searchPlace } from '../queries/place'
import {
    userFavourites,
    updateFavourites,
    userDrafts,
    updateDrafts,
} from '../queries/user'
import { Rate } from './Random'
import { removeItemFromList } from './main'

class SearchResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rate_random: [...Array(30).keys()].map(key => Rate()),
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
        if (!this.props.getLoadFavs && this.props.userID !== '')
            this.props.userFavourites.refetch({ id: this.props.userID })
        if (!this.props.getLoadDrafts && this.props.userID !== '')
            this.props.userDrafts.refetch({ id: this.props.userID })
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
        if (
            prevProps.userFavourites.loading &&
            !this.props.userFavourites.loading &&
            !this.props.getLoadFavs
        ) {
            const fav_places = this.props.userFavourites.user.favourite
            this.props.setfavs(fav_places)
            this.props.setloadfavs(true)
        }
        if (
            prevProps.userDrafts.loading &&
            !this.props.userDrafts.loading &&
            !this.props.getLoadDrafts
        ) {
            const draft_places = this.props.userDrafts.user.draft
            this.props.setdrafts(draft_places)
            this.props.setloaddrafts(true)
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

    setDrafts = place => {
        const { placeID, categoryCode, name } = place
        const draft = {
            placeID,
            categoryCode: categoryCode.toLowerCase(),
            name,
        }
        const places = this.props.getDrafts.map(place => place.placeID)
        let new_drafts
        // ADD
        if (!places.includes(placeID)) {
            new_drafts = [...this.props.getDrafts, draft]
            this.props.adddraft(draft)
        }
        // REMOVE
        else {
            new_drafts = removeItemFromList(
                this.props.getDrafts,
                placeID,
                places
            )
            this.props.setdrafts(new_drafts)
        }

        this.props.updateDrafts({
            variables: {
                id: this.props.userID,
                draft: new_drafts.map(place => {
                    return {
                        placeID: place.placeID,
                        categoryCode: place.categoryCode,
                    }
                }),
            },
        })
    }

    setFavs = place => {
        const { placeID, categoryCode, rate, thumbnail, name, location } = place
        const draft = {
            placeID,
            categoryCode: categoryCode.toLowerCase(),
            name,
            thumbnail,
            rate,
            location,
        }
        // console.log("draft:", draft)
        const favs_id = this.props.getFavs.map(place => place.placeID)
        let new_favs
        // ADD
        if (!favs_id.includes(placeID)) {
            new_favs = [...this.props.getFavs, draft]
            this.props.addfav(draft)
        }
        // REMOVE
        else {
            new_favs = removeItemFromList(this.props.getFavs, placeID, favs_id)
            this.props.setfavs(new_favs)
        }

        this.props.updateFavourites({
            variables: {
                id: this.props.userID,
                favourite: new_favs.map(place => {
                    return {
                        placeID: place.placeID,
                        categoryCode: place.categoryCode,
                    }
                }),
            },
        })
    }

    genSigninTab = () => (
        <div className='add-fav'>
            <Link to='/auth'>
                <div className='add'>
                    <span className='icon'>
                        <Add stroke='#B0B0B0' />
                    </span>
                </div>
            </Link>
            <Link to='/auth'>
                <div className='fav'>
                    <span className='icon'>
                        <Fav fill='#B0B0B0' />
                    </span>
                </div>
            </Link>
        </div>
    )

    genTabs(place) {
        const { placeID: id, categoryCode: code } = place
        const add = this.props.getDrafts.map(key => key.placeID)
        let fav = !this.props.getLoadFavs
            ? this.props.userFavourites.user.favourite
            : this.props.getFavs
        fav = fav.map(key => key.placeID)
        return (
            <div className='add-fav'>
                <div
                    className={`add ${add.includes(id) ? 'active' : ''}`}
                    onClick={() => this.setDrafts(place)}
                >
                    <span className='icon'>
                        {add.includes(id) ? (
                            <Add stroke='#fff' />
                        ) : (
                            <Add stroke='#B0B0B0' />
                        )}
                    </span>
                </div>
                <div
                    className={`fav ${fav.includes(id) ? 'active' : ''}`}
                    onClick={e => this.setFavs(place)}
                >
                    <span className='icon'>
                        {fav.includes(id) ? (
                            <Fav fill='#fff' />
                        ) : (
                            <Fav fill='#B0B0B0' />
                        )}
                    </span>
                </div>
            </div>
        )
    }

    genStar(ratting) {
        const container = []
        let i
        for (i = 0; i < ratting; i++) {
            container.push(
                <span className='star'>
                    <Star star='full' size='12' />
                </span>
            )
        }
        for (i = 0; i < 5 - ratting; i++) {
            container.push(
                <span className='star'>
                    <Star star='blank' size='12' />
                </span>
            )
        }
        return <span className='rating'>{container}</span>
    }

    genCards(places) {
        const box = []
        places.forEach((place, i) => {
            const {
                placeID,
                categoryCode,
                rate,
                thumbnail,
                name,
                location,
            } = place
            box.push(
                <div className='card' key={`${placeID}`}>
                    <Link
                        className='link'
                        to={`/detail?place=${placeID}, ?code=${categoryCode}`}
                    >
                        <img className='picture' alt={name} src={thumbnail} />
                    </Link>
                    <Link
                        className='go-to-detail'
                        to={`/detail?place=${placeID}&code=${categoryCode}`}
                    >
                        <div className='content'>
                            <div className='line1'>{name}</div>
                            <div className='line-group'>
                                <div className='line2'>
                                    {/* {this.genStar(place.rate)} */}
                                    {this.genStar(
                                        this.state.rate_random[+i % 30]
                                    )}
                                    <span className='dot' />
                                    <span className='category'>
                                        {categoryCode}
                                    </span>
                                </div>
                                <div className='line3'>
                                    <img alt='time' src={Time} />
                                    <span className='time'>
                                        8.00 AM - 4.00 PM
                                    </span>
                                </div>
                                <div className='line4'>
                                    <img
                                        alt='location'
                                        src={PinkLocationIcon}
                                    />
                                    <div className='information'>
                                        <span className='map'>0.7 km</span>
                                        <span className='dot' />
                                        <span className='location'>
                                            {`${location.district}, ${location.province}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    {this.props.userID !== ''
                        ? this.genTabs(place)
                        : this.genSigninTab()}
                </div>
            )
        })
        return <div className='card-container'>{box}</div>
    }

    render() {
        console.log(this.state.userLocation)
        if (
            this.state.loading ||
            this.props.search.loading ||
            this.props.userFavourites.loading ||
            this.props.userDrafts.loading
        )
            return <div className='search-result'>Loading</div>
        if (this.props.search.error !== undefined)
            return <div className='search-result'>{this.noneResult()}</div>
        return (
            <div className='search-result'>
                {this.genCards(this.props.search.places)}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userID: state.userauth.userid,
        getDrafts: state.planner.drafts,
        getFavs: state.planner.favourites,
        getLoadFavs: state.planner.load_favs,
        getLoadDrafts: state.planner.load_drafts,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        adddraft: draft =>
            dispatch({
                type: PlannersAction.ADDDRAFT,
                add_draft: draft,
            }),
        setdrafts: drafts =>
            dispatch({
                type: PlannersAction.SETDRAFTS,
                new_drafts: drafts,
            }),
        setloaddrafts: status =>
            dispatch({ type: PlannersAction.LOADDRAFTS, load: status }),
        addfav: fav =>
            dispatch({ type: PlannersAction.ADDFAV, add_favourites: fav }),
        setfavs: favs =>
            dispatch({ type: PlannersAction.SETFAVS, new_favourites: favs }),
        setloadfavs: status =>
            dispatch({ type: PlannersAction.LOADFAVS, load: status }),
    }
}

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withRouter,
    GoogleApiWrapper({
        apiKey: process.env.MAP_KEY,
    }),
    graphql(searchPlace, { name: 'search' }),
    graphql(userFavourites, { name: 'userFavourites' }),
    graphql(updateFavourites, { name: 'updateFavourites' }),
    graphql(userDrafts, { name: 'userDrafts' }),
    graphql(updateDrafts, { name: 'updateDrafts' })
)(SearchResult)
