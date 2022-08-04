import React, { Component } from 'react';
import './App.scss';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from '../Components/AppBar/AppBar';
import CategoryPage from '../Pages/Category/CategoryPage';
import DescriptionPage from '../Pages/Description/DescriptionPage';
import CartPage from '../Pages/Cart/CartPage';
import MissingPage from '../Pages/Missing/MissingPage';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openCurrSwitcher: false,
      openMiniCartOverlay: false
    }
  }

  setOpenCurrSwitcher = (state) => {
    this.setState({ openCurrSwitcher: state })
  }

  setOpenMiniCartOverlay = (state) => {
    this.setState({ openMiniCartOverlay: state })
  }

  handle_CloseCartOrCurr = () => {
    if (this.state.openCurrSwitcher) {
      this.setState({ openCurrSwitcher: false })
    }
    if (this.state.openMiniCartOverlay) {
      this.setState({ openMiniCartOverlay: false })
    }
  }

  total_no_of_cart_items = () => {
    if (this.props.UserCarts?.length > 0) {
      let temp_total = 0;
      for (let i = 0; i < this.props.UserCarts?.length; i++) {
        temp_total += parseInt(this.props.UserCarts[i]?.quantity);
      }
      this.props.setTotalCarts(temp_total);
    } else {
      this.props.setTotalCarts(0);
    }
  }

  total_cart_prices = () => {
    const current_currency = this.props.AllCurrencies[this.props.CurrentCurrency]?.symbol;
    if (this.props.UserCarts?.length > 0) {
      let temp_total_price = 0;
      for (let i = 0; i < this.props.UserCarts?.length; i++) {
        const quantity = parseInt(this.props.UserCarts[i]?.quantity);
        const price_obj = this.props.UserCarts[i]?.prices?.filter(item => item?.currency?.symbol === current_currency)
        const price = parseFloat(price_obj[0]?.amount);
        temp_total_price += parseFloat(price * quantity);
      }
      const stringify_total_price = temp_total_price.toString();
      const total_price_to_2dp = parseFloat(stringify_total_price).toFixed(2);
      this.props.setTotalCartsPrice(total_price_to_2dp);
    } else {
      this.props.setTotalCartsPrice("0.00");
    }
  }

  componentDidMount = () => {
    this.total_no_of_cart_items();
    this.total_cart_prices();
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      this.total_no_of_cart_items();
      this.total_cart_prices();
    }
  }

  render() {
    return (
      <div className='app_main'>
        <AppBar
          openCurrSwitcher={this.state.openCurrSwitcher}
          openMiniCartOverlay={this.state.openMiniCartOverlay}
          setOpenCurrSwitcher={this.setOpenCurrSwitcher}
          setOpenMiniCartOverlay={this.setOpenMiniCartOverlay}
          handle_CloseCartOrCurr={this.handle_CloseCartOrCurr}
        />
        <Switch>
          <Redirect exact={true} from="/" to="/products" />
          <Route exact path="/products">
            <CategoryPage
              handle_CloseCartOrCurr={this.handle_CloseCartOrCurr}
              openMiniCartOverlay={this.state.openMiniCartOverlay}
            />
          </Route>
          <Route path="/products/:id">
            <DescriptionPage
              handle_CloseCartOrCurr={this.handle_CloseCartOrCurr}
              openMiniCartOverlay={this.state.openMiniCartOverlay}
            />
          </Route>
          <Route path="/carts">
            <CartPage
              handle_CloseCartOrCurr={this.handle_CloseCartOrCurr}
              openMiniCartOverlay={this.state.openMiniCartOverlay}
            />
          </Route>
          <Route path="*">
            <MissingPage
              handle_CloseCartOrCurr={this.handle_CloseCartOrCurr}
              openMiniCartOverlay={this.state.openMiniCartOverlay}
            />
          </Route>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    UserCarts: state.UserCarts,
    CurrentCurrency: state.CurrentCurrency,
    AllCurrencies: state.AllCurrencies
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTotalCarts: (total_carts) => dispatch({ type: 'SET_TOTAL_CARTS', payload: total_carts }),
    setTotalCartsPrice: (total_price) => dispatch({ type: 'SET_TOTAL_CARTS_PRICE', payload: total_price })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);