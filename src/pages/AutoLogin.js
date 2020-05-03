
import React, { Component } from "react";
import { View } from "react-native";
import { store } from '../redux/store';

class AutoLogin extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount = () => {
        console.log('AutoLogin')
        const { navigation } = this.props;
        try {
            if (store.getState().LoginReducer) {
                navigation.replace('Dashboard');
            } else {
                navigation.replace('Login');
            }
        } catch (error) {
            console.log('autologin', error)
            navigation.replace('Login');
        }
    }

    render() {
        return (
            <View />
        )
    }
}

export default AutoLogin;
