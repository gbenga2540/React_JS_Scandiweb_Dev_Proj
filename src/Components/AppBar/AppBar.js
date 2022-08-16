import React, { Component } from 'react';
import './AppBar.scss';
import Logo from '../../Images/Logo.svg';
import ArrowDown from '../../Images/ArrowDown.svg';
import Cart from '../../Images/Cart.svg';
import { connect } from 'react-redux';
import { GET_CATEGORIES } from '../../GraphQL/Queries';
import CurrencySwitcher from '../CurrencySwitcher/CurrencySwitcher';
import MiniCart from '../MiniCart/MiniCart';
import { withRouter } from 'react-router-dom';
import { back_end_endpoint } from '../../Configs/BackEndEndpoint';

class AppBar extends Component {

    getdata = async () => {
        await fetch(back_end_endpoint(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "operationName": GET_CATEGORIES.operationName,
                "query": GET_CATEGORIES.query,
                "variables": {}
            })
        })
            .catch(error => console.error(error))
            .then(async (res) => {
                const json_data = await res.json();
                const raw_data = json_data?.data?.categories;
                const convObjtoArr = (Obj) => {
                    const Arr = [];
                    if (Obj) {
                        for (let i = 0; i < Obj.length; i++) {
                            const element = Obj[i].name
                            Arr.push(element);
                        }
                    }
                    return Arr;
                }
                const processed_data = convObjtoArr(raw_data);
                this.props.setAllCategories(processed_data);
            })
    }

    componentDidMount = () => {
        this.getdata();
    }

    render() {
        return (
            <div className='appbar_main_max_w'>
                <div className='appbar_main'>
                    <span className='a_m_cat' onClick={this.props.handle_CloseCartOrCurr}>
                        {this.props.AllCategories?.length > 0 &&
                            this.props.AllCategories?.map((category, i) =>
                                <span
                                    key={i}
                                    className='a_m_cat_nl'
                                    id={i === this.props.CurrentCategory ? 'a_m_cat_nl' : ''}
                                    onClick={() => {
                                        this.props.setCurrentCategory(i);
                                        if (this.props.location?.pathname !== "/products") {
                                            this.props.history?.push(`/products`);
                                        }
                                    }}
                                >
                                    <p>{category.toUpperCase()}</p>
                                </span>
                            )}
                    </span>
                    <div className='a_m_img' onClick={this.props.handle_CloseCartOrCurr}>
                        <img
                            src={Logo}
                            alt='ScandiWeb_Logo'
                        />
                    </div>
                    <span className='a_m_cur_cart' onClick={this.props.handle_CloseCartOrCurr}>
                        <span
                            className="a_m_c_c_cur"
                            onClick={() => this.props.setOpenCurrSwitcher(!this.props.openCurrSwitcher)}
                        >
                            <p>{this.props.AllCurrencies?.length > 0 &&
                                this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol
                            }</p>
                            <img
                                src={ArrowDown}
                                alt='Arr_Dwn'
                                id={this.props.openCurrSwitcher ? 'img' : ''}
                            />
                        </span>
                        <span
                            className='a_m_c_c_cart'
                            onClick={() => this.props.setOpenMiniCartOverlay(!this.props.openMiniCartOverlay)}
                        >
                            {this.props.TotalCarts > 0 && <p>{this.props.TotalCarts}</p>}
                            <img
                                src={Cart}
                                alt='cart'
                            />
                        </span>
                    </span>
                    <div
                        className='a_m_cur_sw'
                        id={this.props.openCurrSwitcher ? 'a_m_cur_sw' : ''}
                    >
                        <CurrencySwitcher
                            handle_CloseCartOrCurr={this.props.handle_CloseCartOrCurr}
                        />
                    </div>
                    <div
                        className='a_m_minicart'
                        id={this.props.openMiniCartOverlay ? 'a_m_minicart' : ''}
                    >
                        <MiniCart
                            handle_CloseCartOrCurr={this.props.handle_CloseCartOrCurr}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        AllCategories: state.AllCategories,
        CurrentCategory: state.CurrentCategory,
        AllCurrencies: state.AllCurrencies,
        CurrentCurrency: state.CurrentCurrency,
        TotalCarts: state.TotalCarts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAllCategories: (all_cat) => dispatch({ type: "ALL_CATEGORIES", payload: all_cat }),
        setCurrentCategory: (current_cat) => dispatch({ type: "CURRENT_CATEGORY", payload: current_cat })
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(withRouter(AppBar)));


