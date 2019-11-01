import React, { Component } from 'react'
import { RateStar, CircleArrow, Star, DoubleQuotes } from './Icon'
import { Reviews } from './Demo'
import '../assets/scss/review.scss'

class Review extends Component {
    constructor() {
        super()
        this.state = {
            show: false,
        }
    }

    showHandle = () => {
        this.setState({
            show: !this.state.show,
        })
    }

    genRate = () => (
        <div className='rate'>
            <div className={`rate-${(Reviews[0].rate * 100) / 5}`}>
                <span>{Reviews[0].rate}</span>
                <img src={RateStar} alt='rate-icon' />
            </div>
        </div>
    )

    genStar = rate =>
        [...Array(5).keys()].map(star =>
            star < rate ? (
                <Star star='full' size='9' />
            ) : (
                <Star star='blank' size='9' />
            )
        )

    genReview = () => {
        if (this.state.show) {
            let box_review = []
            Reviews.forEach((item, i) => {
                if (i !== 0) {
                    const date = new Date(item.timestamp)
                        .toString()
                        .split(' ')
                        .splice(1, 3)
                    box_review = [
                        ...box_review,
                        <div className='review' key={item.id}>
                            <div className='sub-review'>{item.review}</div>
                            <div className='sub-detail'>
                                <div className='sub-rate'>
                                    {this.genStar(item.rate)}
                                </div>
                                <span>{item.author}</span>
                                <span>{`${date[1]} ${
                                    date[0]
                                } ${date[2].substring(0, 2)}`}</span>
                            </div>
                        </div>,
                    ]
                }
            })
            return (
                <div className='sub-section-reviews'>
                    <div className='show-control' onClick={this.showHandle}>
                        <span>less reivews</span>
                        <img src={CircleArrow} alt='up-circle-arrow' />
                    </div>
                    <div className='other-reviews show'>{box_review}</div>
                </div>
            )
        }
        return (
            <div className='sub-section-reviews'>
                <div className='show-control down' onClick={this.showHandle}>
                    <span>more reivews</span>
                    <img src={CircleArrow} alt='down-circle-arrow' />
                </div>
                <div className='other-reviews' />
            </div>
        )
    }

    render() {
        return (
            <div className='review-section'>
                <div className='sub-review-section'>
                    {this.genRate()}
                    <div className='best-review'>
                        <img
                            className='double-quotes left'
                            src={DoubleQuotes}
                            alt='double-quotes'
                        />
                        {Reviews[0].review}
                        <img
                            className='double-quotes right'
                            src={DoubleQuotes}
                            alt='double-quotes'
                        />
                    </div>
                </div>
                {this.genReview()}
            </div>
        )
    }
}
export default Review
