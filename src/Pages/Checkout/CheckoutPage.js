import React, { Component } from 'react';
import './CheckoutPage.scss';

class CheckoutPage extends Component {

    componentDidMount = () => {
        document.title = `ScandiStore | Checkout`;
    }

    render() {
        return (
            <main className='checkoutpage_main' onClick={this.props.handle_CloseCartOrCurr}>
                <div className='cop_m_wrapper'>
                    <h1 className='cop_m_h'>CHECKOUT</h1>
                </div>
            </main>
        )
    }
}

export default CheckoutPage;
