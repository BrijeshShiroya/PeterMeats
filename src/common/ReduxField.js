/*
 * @Name - SignUp.js
 * @purpose - SignUp component to register new user
 * @params - NA
 *
 */
import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput
} from "react-native";
import colors from "../assets/styles/colors";
import { Field } from 'redux-form';
import CheckBox from '../common/CheckBox';
// import { Dropdown } from 'react-native-material-dropdown';
import Dropdown from '../controls/Dropdown';

export default class ReduxField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }

    renderInput = ({ input, label, type, meta: { touched, error, warning }, ...restProps }) => {
        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        // console.log('restProps', input)
        const { inputType } = restProps;
        let subComponent = null;

        switch (inputType) {
            case 'dropdown': {
                const { data, callBack } = restProps;
                subComponent = (
                    <Dropdown
                        // label={input.name}
                        options={data}
                        onChangeText={(value, index, data) => {
                            input.onChange(value);
                            callBack && callBack(value, index, data)
                        }}
                    />)
            }
                break;
            case 'checkbox': {
                const { callBack } = restProps;
                subComponent = (
                    <CheckBox
                        text={input.name}
                        value={input.value}
                        getValue={(value) => {
                            input.onChange(value);
                            callBack && callBack(value)
                        }} />
                )
            }
                break;
            default:
                subComponent = (
                    <TextInput
                        {...input}
                        onChangeText={input.onChange}
                        {...restProps}
                    />
                )
                break;
        }
        return (
            <View>
                {subComponent}
                {hasError && touched ? <Text style={{ color: colors.red }}>{error}</Text> : null}
            </View>
        )
    }

    render() {
        return (
            <View>
                <Field
                    {...this.props}
                    component={this.renderInput}
                />
            </View>
        );
    }
}

/*
 * @purpose - Common  style
 * @params - NA
 */
const styles = StyleSheet.create({

});
