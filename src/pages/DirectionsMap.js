

import React, { Component } from "react";
import CustomerLocation from "../bottomTabs/CustomerLocation";
import CommonUtils from '../utils/CommonUtils';
import withHome from '../redux/Dashboard/action';
import withLoader from '../redux/Loader/action';

class DirectionsMap extends Component {
    constructor(props) {
        super(props);
        global.mapPath = true;
        this.state = {
            markers: []
        };
    }

    componentDidMount = async () => {
        const { setLoader, userLocation } = this.props;
        await setLoader(true);
        const googleResponse = await CommonUtils.googlePath("70+Edgeware+Rd+Edgeware+Christchurch+NZ", userLocation.description.replace(/\s/g, "+"));
        console.log('googleResponse', googleResponse)
        if (googleResponse.routes.length) {
            this.setState({
                markers: this.decode(googleResponse.routes[0].overview_polyline.points) // definition below
            });
        }
        await setLoader(false);
    }

    componentWillUnmount = () => {
        global.mapPath = false;
    }

    decode = (t, e) => { for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) { a = null, h = 0, i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]) } return d = d.map(function (t) { return { latitude: t[0], longitude: t[1] } }) }

    render() {
        const { markers } = this.state;
        return (
            <CustomerLocation {...this.props} markers={markers} currenScreen={'DirectionsMap'} />
        )
    }
}

export default withLoader(withHome(DirectionsMap));