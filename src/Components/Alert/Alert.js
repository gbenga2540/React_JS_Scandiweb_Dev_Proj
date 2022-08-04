import React, { Component } from 'react';
import './Alert.scss';

class Alert extends Component {
    render() {
        return (
            <section className='alert_main'>
                <div className='alert_w'>
                    <h1>{this.props.structure?.heading}</h1>
                    <p>{this.props.structure?.sub_heading}</p>
                    {this.props.structure?.actions?.map((item, i) => <button key={i} onClick={item?.handleFunc}>{item?.name}</button>)}
                </div>
            </section>
        )
    }
}

export default Alert;
