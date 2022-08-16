import React, { Component } from 'react';
import './MissingPage.scss';
import { withRouter } from 'react-router-dom';

class MissingPage extends Component {

    Redirect = () => {
        this.props.history?.push(`/products`);
    }

    componentDidMount = () => {
        document.title = 'Scandiweb Dev Test | Misiing';
    }

    render() {
        return (
            <div onClick={() => this.props.handle_CloseCartOrCurr()} className='missingpage_main'>
                <h1>Page Not Found!!!</h1>
                <p>Please, click the button below to get redirected to the Product Page.</p>
                <button onClick={this.Redirect}>Product Page</button>
            </div>
        )
    }
}

export default withRouter(MissingPage);
