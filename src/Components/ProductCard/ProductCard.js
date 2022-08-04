import React, { Component } from 'react';
import './ProductCard.scss';
import CartIcon from '../../Images/CartWhite.svg';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ProductCard extends Component {

    AddtoCart = () => {
        let CartItem = {};

        CartItem["id"] = this.props.product_info?.id;
        CartItem["brand"] = this.props.product_info?.brand;
        CartItem["name"] = this.props.product_info?.name;
        CartItem["gallery"] = this.props.product_info?.gallery;
        CartItem["prices"] = this.props.product_info?.prices;
        CartItem["inStock"] = this.props.product_info?.inStock;
        CartItem["attributes"] = this.props.product_info?.attributes;
        CartItem["quantity"] = 1;

        if (this.props.product_info?.attributes?.length > 0) {
            if (window.confirm('This product contains attributes, would you like to select the first option of each attribute as a default before adding to cart?')) {
                for (let i = 0; i < this.props.product_info?.attributes?.length; i++) {
                    CartItem[this.props.product_info?.attributes[i]?.id] = this.props.product_info?.attributes[i]?.items[0]?.value;
                }
                this.props.AddtoUserCart(CartItem);
            } else {
                alert("Product was not added to cart!!!")
            }
        } else {
            this.props.AddtoUserCart(CartItem);
        }
    }

    handleAddtoCart = () => {
        if (this.props.UserCarts?.length > 0) {
            let ProductInCart = false;
            for (let i = 0; i < this.props.UserCarts?.length; i++) {
                if (this.props.UserCarts[i]?.id === this.props.product_info?.id) {
                    ProductInCart = true;
                }
            }

            if (ProductInCart) {
                if (this.props.product_info?.attributes?.length > 0) {
                    if (window.confirm(`This product is available in your cart!. Would you like to add it to your cart once more?`)) {
                        this.AddtoCart();
                    }
                } else {
                    if (window.confirm(`This product has no attribute and it's available in cart!. Would you like to view the cart page`)) {
                        this.props.history?.push(`/carts`);
                    }
                }
            } else {
                this.AddtoCart();
            }

        } else {
            this.AddtoCart();
        }
    }

    handleOpenPDP = () => {
        this.props.history?.push(`/products/${this.props.product_info?.id}`)
    }

    handlePriceBasedOnCurr = () => {
        if (this.props.product_info?.prices.length > 0) {
            const current_currency_symbol = this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol;
            const currency_obj = this.props.product_info?.prices.filter(item => item?.currency?.symbol === current_currency_symbol);
            return currency_obj[0]?.amount === undefined ? '' : currency_obj[0]?.amount;
        }
    }

    render() {
        return (
            <section className='productcard_main'>
                <div
                    className='pc_m_oos'
                    id={this.props.product_info?.inStock ? '' : 'pc_m_oos'}
                    onClick={this.handleOpenPDP}
                >
                    <p>OUT OF STOCK</p>
                </div>
                <div
                    className={this.props.product_info?.inStock ? 'pc_m_cart' : 'pc_m_cart_dn'}
                    onClick={this.handleAddtoCart}>
                    <img
                        src={CartIcon}
                        alt='add'
                    />
                </div>
                {this.props.product_info?.gallery[0].includes("http") && this.props.product_info?.gallery[0].length > 30 ?
                    <img
                        src={this.props.product_info?.gallery[0]}
                        alt='product'
                        className='pc_m_img'
                        id={this.props.product_info?.inStock ? '' : 'pc_m_img'}
                        onClick={this.handleOpenPDP}
                    /> : <div className='pc_m_img'></div>
                }
                <div className='pc_m_desc'>
                    <div
                        className='pc_m_ep'
                        onClick={this.handleOpenPDP}
                    ></div>
                    <p
                        className='pc_m_bname'
                        id={this.props.product_info?.inStock ? '' : 'pc_m_bname'}
                        onClick={this.handleOpenPDP}
                    >{`${this.props.product_info?.brand} ${this.props.product_info?.name}`}</p>
                    <p
                        className='pc_m_bname pc_m_price'
                        id={this.props.product_info?.inStock ? '' : 'pc_m_bname'}
                        onClick={this.handleOpenPDP}
                    >
                        {this.props.AllCurrencies?.length > 0 ?
                            this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol : ''
                        }
                        {this.handlePriceBasedOnCurr() === undefined ? '' : this.handlePriceBasedOnCurr()}
                    </p>
                </div>
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        CurrentCurrency: state.CurrentCurrency,
        AllCurrencies: state.AllCurrencies,
        UserCarts: state.UserCarts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        AddtoUserCart: (item) => dispatch({ type: "USER_CARTS", payload: item }),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCard));
