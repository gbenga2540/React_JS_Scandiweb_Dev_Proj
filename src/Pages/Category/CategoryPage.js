import React, { Component } from 'react';
import './CategoryPage.scss';
import ArrowLeftBlack from '../../Images/ArrowLeftBlack.png';
import ProductCard from '../../Components/ProductCard/ProductCard';
import { connect } from 'react-redux';
import { GET_CATEGORY_PRODUCTS } from '../../GraphQL/Queries';
import { back_end_endpoint } from '../../Configs/BackEndEndpoint';

class CategoryPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            max_product_per_page: 6,
            p_first_index: 0,
            p_last_index: 6,
            l_error: false
        }
    }

    decreaseProductFilter = () => {
        if (this.state.p_first_index > 0) {
            this.setState({ p_first_index: this.state.p_first_index - this.state.max_product_per_page, p_last_index: this.state.p_last_index - this.state.max_product_per_page });
        }
        window.scrollTo(0, 0);
    }

    increaseProductFilter = () => {
        if (this.state.p_last_index < this.props.ProductList?.length) {
            this.setState({ p_first_index: this.state.p_first_index + this.state.max_product_per_page, p_last_index: this.state.p_last_index + this.state.max_product_per_page });
        }
        window.scrollTo(0, 0);
    }

    getdata = () => {
        const load_products = async () => {
            await fetch(back_end_endpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "operationName": GET_CATEGORY_PRODUCTS({ category: this.props.AllCategories[this.props.CurrentCategory] }).operationName,
                    "query": GET_CATEGORY_PRODUCTS({ category: this.props.AllCategories[this.props.CurrentCategory] }).query,
                    "variables": {}
                })
            })
                .catch(error => {
                    this.setState({ l_error: true });
                    console.error(error);
                })
                .then(async (res) => {
                    const json_data = await res.json();
                    const raw_data = json_data?.data?.category;
                    this.props.SetProductList(raw_data?.products);
                    this.setState({
                        p_first_index: 0,
                        p_last_index: this.state.max_product_per_page,
                        l_error: false
                    });
                });
        }

        if (this.props.AllCategories.length > 0) {
            load_products();
        } else {
            // Waits for 2.5s for the category name to load
            setTimeout(() => {
                if (this.props.AllCategories.length > 0) {
                    load_products();
                } else {
                    setTimeout(() => {
                        // Waits for 3s for the category name to load
                        load_products();
                    }, 3000)
                }
            }, 2500)
        }
    }

    handle_Update = () => {
        this.setState({ l_error: false });
        this.props.ClearProductList();
        document.title = `Scandiweb Dev Test ${this.props.AllCategories?.length > 0 ? '|' : ''} ${this.props.AllCategories?.length > 0 ? this.props.AllCategories[this.props.CurrentCategory][0]?.toUpperCase() : ''}${this.props.AllCategories?.length > 0 ? this.props.AllCategories[this.props.CurrentCategory]?.slice(1).toLowerCase() : ''}`;
        this.getdata();
        window.scrollTo(0, 0);
    }

    componentDidMount = () => {
        this.handle_Update();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.CurrentCategory !== this.props.CurrentCategory) {
            this.handle_Update();
        } else {
            if (this.state.error) {
                this.handle_Update();
            }
        }
    }

    render() {
        return (
            <main
                className='categorypage_main'
                onClick={this.props.handle_CloseCartOrCurr}
            >
                {this.props.ProductList?.length > 0 && <div>
                    <h1 className='cp_m_h1'>
                        {this.props.AllCategories?.length > 0 &&
                            this.props.AllCategories[this.props.CurrentCategory][0]?.toUpperCase()
                        }
                        {this.props.AllCategories?.length > 0 &&
                            this.props.AllCategories[this.props.CurrentCategory]?.slice(1).toLowerCase()
                        }
                    </h1>
                    <div className='cp_m_product_w'>
                        {this.props.ProductList?.length > 0 &&
                            this.props.ProductList?.slice(this.state.p_first_index, this.state.p_last_index)?.map((item, i) =>
                                <ProductCard key={i} product_info={item} />
                            )
                        }
                    </div>
                    <div className='cp_m_pagination'>
                        <img
                            src={ArrowLeftBlack}
                            alt='<'
                            onClick={this.decreaseProductFilter}
                        />
                        <p>{this.state.p_first_index + 1}</p>
                        <p>-</p>
                        <p>{this.state.p_last_index > this.props.ProductList?.length ? this.props.ProductList?.length : this.state.p_last_index}</p>
                        <img
                            className='cp_m_p_ar'
                            src={ArrowLeftBlack}
                            alt='>'
                            onClick={this.increaseProductFilter}
                        />
                    </div>
                </div>
                }
                {this.props.ProductList?.length < 0 && this.state.l_error === false &&
                    <p className='cp_m_loading'>Loading Products...</p>
                }
                {this.state.l_error === true &&
                    <p className='cp_m_loading' id='cp_m_loading'>Error Loading Products...</p>
                }
            </main>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        AllCategories: state.AllCategories,
        CurrentCategory: state.CurrentCategory,
        ProductList: state.ProductList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        SetProductList: (p_list) => dispatch({ type: 'SET_PRODUCT_LIST', payload: p_list }),
        ClearProductList: () => dispatch({ type: 'CLEAR_PRODUCT_LIST' })
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(CategoryPage));
