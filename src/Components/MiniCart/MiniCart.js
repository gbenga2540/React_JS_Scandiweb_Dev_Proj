import React, { Component } from 'react';
import './MiniCart.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CartItem from '../CartItem/CartItem';
import { Scrollbars } from 'react-custom-scrollbars-2'

class MiniCart extends Component {

    openCart = () => {
        this.props.history?.push(`/carts`);
        this.props.handle_CloseCartOrCurr();
    }

    openCheckout = () => {
        this.props.history?.push(`/checkout`);
        this.props.handle_CloseCartOrCurr();
    }

    render() {
        return (
            <section className='minicart_main'>
                <p className='mc_m_p'><span>My Bag</span>, {this.props.TotalCarts} item{this.props.TotalCarts > 1 ? 's' : ''}</p>
                <div className='mc_m_ci'>
                    <Scrollbars style={{ width: '100%', height: '350px' }}>
                        {this.props.UserCarts?.length > 0 &&
                            this.props.UserCarts?.map((item, i) =>
                                <CartItem key={i} isMini={true} cart_info={item} cart_index={i} />
                            )
                        }
                        {this.props.UserCarts?.length <= 0 &&
                            <p className='mc_m_ec'>Your cart is Empty</p>
                        }
                    </Scrollbars>
                </div>
                <div className='mc_m_t'>
                    <p>Total</p>
                    <p className='mc_m_t_price'>
                        {this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol}
                        {this.props.UserCarts?.length <= 0 ? "0.00" : this.props.TotalCartsPrice}
                    </p>
                </div>
                <div className='mc_m_b'>
                    <button type='button' onClick={this.openCart}>VIEW BAG</button>
                    <button type='button' className='mc_m_b_chkout' onClick={this.openCheckout}>CHECK OUT</button>
                </div>
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        TotalCarts: state.TotalCarts,
        TotalCartsPrice: state.TotalCartsPrice,
        UserCarts: state.UserCarts,
        CurrentCurrency: state.CurrentCurrency,
        AllCurrencies: state.AllCurrencies
    }
}

export default withRouter(connect(mapStateToProps)(MiniCart));
