

import React, { Component } from "react";
import CustomerLocation from "../bottomTabs/CustomerLocation";

class SignupMap extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CustomerLocation {...this.props} currenScreen={'SignupMap'} />
        )
    }
}

export default SignupMap;