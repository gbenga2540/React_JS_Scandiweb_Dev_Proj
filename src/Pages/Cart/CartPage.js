import React, { Component } from 'react';
import './CartPage.scss';
import { connect } from 'react-redux';
import CartItem from '../../Components/CartItem/CartItem';

class CartPage extends Component {

    calc_tax = () => {
        const current_total = parseFloat(this.props.TotalCartsPrice);
        const tax = 0.21 * current_total;
        return tax.toFixed(2);
    }

    componentDidMount = () => {
        document.title = 'Scandiweb Dev Test | Carts';
        this.props.UpdateTotalCartsTax(this.calc_tax());
        window.scrollTo(0, 0);
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.TotalCartsPrice !== this.props.TotalCartsPrice) {
            this.props.UpdateTotalCartsTax(this.calc_tax());
        }
    }

    render() {
        return (
            <main
                className='cartpage_main'
                onClick={this.props.handle_CloseCartOrCurr}
            >
                <div
                    className='cp_m_fade'
                    id={this.props.openMiniCartOverlay ? 'cp_m_fade' : ''}
                ></div>
                <div className='cp_m_wrapper'>
                    <h1 className='cp_m_h'>CART</h1>
                    {this.props.UserCarts?.length > 0 && <hr className='cp_m_hr' />}
                    {this.props.UserCarts?.length > 0 &&
                        this.props.UserCarts?.map((item, i) =>
                            <div key={i}>
                                <CartItem isMini={false} cart_info={item} cart_index={i} />
                                <hr className='cp_m_hr' />
                            </div>
                        )
                    }
                    {this.props.UserCarts?.length <= 0 &&
                        <p style={{
                            textAlign: 'left',
                            fontFamily: 'Raleway, sans-serif',
                            fontWeight: 500
                        }}>Your cart is Empty</p>
                    }
                    {this.props.UserCarts?.length > 0 &&
                        <div className='cp_m_orders_sum'>
                            <p className='cp_m_o_s_tax'>Tax 21%: <span>{this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol}{this.props.TotalCartsTax}</span></p>
                            <p>Quantity: <span>{this.props.TotalCarts}</span></p>
                            <p className='cp_m_o_s_total'>Total: <span>{this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol}{this.props.TotalCartsPrice}</span></p>
                            <button className='cp_m_btn'>ORDER</button>
                        </div>
                    }
                </div>
            </main>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        UserCarts: state.UserCarts,
        TotalCarts: state.TotalCarts,
        TotalCartsPrice: state.TotalCartsPrice,
        TotalCartsTax: state.TotalCartsTax,
        CurrentCurrency: state.CurrentCurrency,
        AllCurrencies: state.AllCurrencies
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UpdateTotalCartsTax: (total_carts_tax) => dispatch({ type: "SET_TOTAL_CARTS_TAX", payload: total_carts_tax })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
