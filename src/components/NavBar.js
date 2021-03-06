/* eslint-disable react/no-typos */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Link, withRouter } from 'react-router-dom'
import {
    Menu,
    Airplane,
    Back,
    SettingButton,
    ShareButton,
    SummaryButton,
} from './Icon'
import SideBar from './SideBar'
import '../assets/scss/navbar.scss'
import SharePlanner from './SharePlanner'

class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            side_nav: false,
        }
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClickOutSide, false)
    }

    handleClickOutside = () => {
        this.setState({ side_nav: false })
    }

    openNav = () => {
        this.setState({ side_nav: true })
    }

    componentWillUnMount() {
        document.removeEventListener(
            'mousedown',
            this.handleClickOutSide,
            false
        )
    }

    goBack(back) {
        if (back) {
            return (
                <div className='back-home' onClick={this.props.history.goBack}>
                    <Back width='11' height='18' stroke='white' fill='white' />
                </div>
            )
        }
    }

    genSideBar() {
        const active = this.state.side_nav ? 'active' : ''
        return (
            <>
                <div
                    className={`container-sidenav ${active}`}
                    ref={node => {
                        this.node = node
                    }}
                    onClick={this.handleClickOutside}
                />
                <div
                    className={`sidenav ${active}`}
                    ref={node => {
                        this.node = node
                    }}
                >
                    {this.state.side_nav && (
                        <SideBar
                            close={() => this.setState({ side_nav: false })}
                        />
                    )}
                </div>
            </>
        )
    }

    render() {
        const design =
            this.props.design === undefined ? 'default' : this.props.design
        return (
            <>
                <div className={`nav-bar ${design}`}>
                    {this.genSideBar()}
                    {this.goBack(this.props.back)}
                    {this.props.design === 'planners-page' && (
                        <div className='tools-navbar'>
                            <img alt='summary' src={SummaryButton} />
                            <SharePlanner />
                            <img alt='setting' src={SettingButton} />
                        </div>
                    )}
                    <Link to={this.props.getUser !== '' ? '/mytrips' : '/auth'}>
                        <button
                            className={`button-mytrips ${
                                this.props.mytrips === false ? 'inactive' : ''
                            }`}
                        >
                            <Airplane
                                fill='#FCB8A0'
                                size='10'
                                alt='icon-mytrips'
                            />
                            My trips
                        </button>
                    </Link>
                    <span onClick={this.openNav}>
                        <img className='menu' src={Menu} alt='menu' />
                    </span>
                </div>
                {this.props.design !== 'planners' && (
                    <div className='blank-navbar' />
                )}
            </>
        )
    }
}
export default compose(
    withRouter,
    connect(state => {
        return { getUser: state.userauth.username }
    })
)(NavBar)
