import React, { Component } from 'react';
import './CartItem.scss';
import { connect } from 'react-redux';
import { GET_PRODUCT_BY_ID } from '../../GraphQL/Queries';
import ArrowLeft from '../../Images/ArrowLeft.png';
import AddSign from '../../Images/AddSign.png';
import SubtractSign from '../../Images/SubtractSign.png';
import { back_end_endpoint } from '../../Configs/BackEndEndpoint';

class CartItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gallery_index: 0
        }
    }

    increaseProductCount = () => {
        const prevData = this.props.UserCarts[this.props.cart_index];
        const newData = { ...prevData, quantity: prevData?.quantity < 1 ? 1 : prevData?.quantity + 1 };
        this.props.UpdateUserCart(this.props.cart_index, { ...newData });
    }

    decreaseProductCount = () => {
        const prevData = this.props.UserCarts[this.props.cart_index];
        const newData = { ...prevData, quantity: prevData?.quantity <= 1 ? 1 : prevData?.quantity - 1 };
        this.props.UpdateUserCart(this.props.cart_index, { ...newData });
    }

    incrementGalleryIndex = () => {
        const MaxIndex = this.props.cart_info?.gallery?.length > 0 ? parseInt(this.props.cart_info?.gallery?.length) - 1 : 0;
        if (MaxIndex === 0) {
            this.setState({ gallery_index: 0 });
        } else if (this.state.gallery_index >= MaxIndex) {
            this.setState({ gallery_index: 0 });
        } else {
            this.setState({ gallery_index: this.state.gallery_index + 1 });
        }
    }

    decrementGalleryIndex = () => {
        const MaxIndex = this.props.cart_info?.gallery?.length > 0 ? parseInt(this.props.cart_info?.gallery?.length) - 1 : 0;
        if (MaxIndex === 0) {
            this.setState({ gallery_index: 0 });
        } else if (this.state.gallery_index <= 0) {
            this.setState({ gallery_index: MaxIndex });
        } else {
            this.setState({ gallery_index: this.state.gallery_index - 1 });
        }
    }

    handleSubTotalCalc = () => {
        const price = this.handlePriceBasedOnCurr()
        const quantity = this.props.cart_info?.quantity;
        const subtotal = price * quantity;
        const stringify_subtotal = subtotal.toString();
        const sub_total_to_2dp = parseFloat(stringify_subtotal).toFixed(2);
        return sub_total_to_2dp;
    }

    handlePriceBasedOnCurr = () => {
        if (this.props.cart_info?.prices?.length > 0) {
            const current_currency_symbol = this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol;
            const currency_obj = this.props.cart_info?.prices?.filter(item => item?.currency?.symbol === current_currency_symbol);
            return currency_obj[0]?.amount === undefined ? '' : currency_obj[0]?.amount.toFixed(2);
        }
    }

    getProductAttributes = () => {
        const attrib = this.props.UserCarts?.filter(item => item.id === this.props.cart_info?.id);
        return attrib[0]?.attributes;
    }

    handle_Update_Attribute = (attrib_name, attrib_value) => {
        const prevData = this.props.UserCarts[this.props.cart_index];
        const newData = {
            ...prevData
        };
        newData[attrib_name] = attrib_value;
        this.props.UpdateUserCart(this.props.cart_index, { ...newData });
    }

    handle_Remove_Cart_Item = () => {
        this.props.RemoveCartItem(this.props.cart_index);
    }

    getdata = async () => {
        await fetch(back_end_endpoint(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "operationName": GET_PRODUCT_BY_ID({ ProductID: this.props.cart_info?.id }).operationName,
                "query": GET_PRODUCT_BY_ID({ ProductID: this.props.cart_info?.id }).query,
                "variables": {}
            })
        })
            .catch(error => console.error(error))
            .then(async (res) => {
                const json_data = await res.json();
                const raw_data = json_data?.data?.product;
                const prevData = this.props.UserCarts[this.props.cart_index];
                const newData = {
                    ...prevData,
                    quantity: prevData?.quantity <= 1 ? 1 : prevData?.quantity,
                    brand: raw_data?.brand,
                    name: raw_data?.name,
                    gallery: raw_data?.gallery,
                    inStock: raw_data?.inStock,
                    prices: raw_data?.prices
                };
                for (let i = 0; i < raw_data?.attributes?.length; i++) {
                    newData[raw_data?.attributes[i]?.id] = prevData[raw_data?.attributes[i]?.id];
                }
                this.props.UpdateUserCart(this.props.cart_index, { ...newData });
            })
    }

    componentDidMount = () => {
        this.getdata();
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.TotalCarts !== prevProps.TotalCarts) {
            this.getdata();
        }
    }

    render() {
        return (
            <section className='cart_item_main' id={this.props.isMini ? '' : 'cart_item_main'}>
                <div className='ci_m_w'>
                    <span className='ci_m_1'>
                        <p className='ci_m_1_p cp_m_1_p_b'>{this.props.cart_info?.brand ? this.props.cart_info?.brand : ''}</p>
                        <p className='ci_m_1_p'>{this.props.cart_info?.name ? this.props.cart_info?.name : ''}</p>
                        <h4 className='ci_m_1_h4'>
                            {this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol}
                            {this.handlePriceBasedOnCurr() === undefined ? '' : this.handlePriceBasedOnCurr()}
                        </h4>
                        {this.getProductAttributes()?.length > 0 &&
                            this.getProductAttributes()?.map((item, i) =>
                                <div key={i} className='ci_m_1_a_w'>
                                    <p className='ci_m_1_a_w_h'>{`${item?.name}:`}</p>
                                    <div className='ci_m_1_a_w_b'>
                                        {item?.type === "text" &&
                                            item?.items?.length > 0 &&
                                            item.items?.map((values, index) =>
                                                <h3
                                                    key={index}
                                                    id={values?.value === this.props.UserCarts?.[this.props.cart_index]?.[item?.name] ? 'h3' : ''}
                                                    onClick={() => this.handle_Update_Attribute(item?.name, values?.value)}
                                                >{values?.value}</h3>
                                            )
                                        }
                                        {item?.type === "swatch" &&
                                            item?.items?.length > 0 &&
                                            item?.items?.map((values, index) =>
                                                <span
                                                    key={index}
                                                    id={values?.value === this.props.UserCarts?.[this.props.cart_index]?.[item?.name] ? 'span' : ''}
                                                    onClick={() => this.handle_Update_Attribute(item?.name, values?.value)}
                                                >
                                                    <div style={{ backgroundColor: values?.value }}></div>
                                                </span>
                                            )
                                        }
                                    </div>
                                </div>
                            )}
                    </span>
                    <span className='ci_m_2'>
                        <div className='ci_m_2_counter'>
                            <button onClick={this.increaseProductCount}>
                                <img src={AddSign} alt='+' />
                            </button>
                            <p>{this.props.cart_info?.quantity}</p>
                            <button onClick={this.decreaseProductCount} className='ci_m_2_c_b'>
                                <img src={SubtractSign} alt='-' />
                            </button>
                        </div>
                        <div className='ci_m_2_image'>
                            {!this.props.isMini && this.props.cart_info?.gallery?.length > 1 &&
                                <button className='ci_m_2_image_al'
                                    onClick={this.decrementGalleryIndex}
                                >
                                    <img src={ArrowLeft} alt='L' />
                                </button>
                            }
                            {!this.props.isMini && this.props.cart_info?.gallery?.length > 1 &&
                                <button className=''
                                    onClick={this.incrementGalleryIndex}
                                >
                                    <img src={ArrowLeft} alt='R' />
                                </button>
                            }
                            <img src={this.props.isMini ?
                                this.props.cart_info?.gallery[0] :
                                this.props.cart_info?.gallery[this.state.gallery_index]} alt='product'
                                className='ci_m_2_i_img'
                            />
                        </div>
                    </span>
                </div>
                <div className='ci_m_oof_btn_rmv'>
                    {!this.props.isMini &&
                        <p className='ci_m_p_subt'>Sub-Total: <span>{this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol}{this.handleSubTotalCalc()}</span></p>
                    }
                    {!this.props.isMini && !this.props.cart_info?.inStock &&
                        <p className='ci_m_p_oof'>OUT OF STOCK</p>
                    }
                    {!this.props.isMini &&
                        <button className='ci_m_btn_rmv' onClick={this.handle_Remove_Cart_Item}>
                            REMOVE
                        </button>
                    }
                </div>
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        TotalCarts: state.TotalCarts,
        CurrentCurrency: state.CurrentCurrency,
        AllCurrencies: state.AllCurrencies,
        UserCarts: state.UserCarts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UpdateUserCart: (index, data) => dispatch({ type: "UPDATE_USER_CARTS", product_index: index, product_data: data }),
        RemoveCartItem: (item_index) => dispatch({ type: "REMOVE_USER_CART_ITEM", payload: item_index })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);
