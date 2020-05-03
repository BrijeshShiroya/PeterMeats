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
    TextInput,
    BackHandler,
    TouchableOpacity,
    Platform
} from "react-native";
import colors from "../assets/styles/colors";
import { scale } from "../utils/FontScaler";
import { store } from '../redux/store';
import { showFilterModal } from "../redux/Dashboard/action";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppFonts from '../assets/fonts/';
import BackBtn from '../controls/BackBtn';

class AppHeader extends Component {
    constructor(props) {
        super(props);
    }

    // componentDidMount = () => {
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    // }

    // componentWillUnmount = () => {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    // }

    // handleBackButton = () => {
    //     console.log('handleBackButton')
    //     return;
    // }

    render() {
        const { navigation, route, noFilter = true, backBtn = true, customeBackView = null } = this.props;
        return (
            <View style={styles.header}>
                <View style={styles.headerView}>
                    <View style={styles.leftView}>
                        {
                            backBtn
                                ?
                                <BackBtn 
                                customeIconStyle={styles.leftBtnIcon}
                                customeTextStyle={styles.leftBtnText} 
                                onPress={() => { navigation.replace(route) }} />
                                : customeBackView
                        }
                    </View>
                    <View style={{ flexDirection: 'column' }} />
                    {
                        noFilter
                            ?
                            <View style={{ flexDirection: 'column' }}>
                                <View style={styles.rightView}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => {
                                            store.dispatch(showFilterModal(true));
                                        }}>
                                        <Text style={styles.leftText}>{'Filters'}</Text>
                                        <MaterialIcons style={styles.leftText} name={'filter-list'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
                    }
                </View>
            </View>
        );
    }
}

/*
 * @purpose - Common  style
 * @params - NA
 */
const styles = StyleSheet.create({
    header: {
        height: Platform.OS == 'ios' ? scale(54) : scale(44),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(10),
        backgroundColor: colors.whitesmoke
    },
    headerView: {
        flexDirection: 'row',
        flex: 1
    },
    leftView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    leftText: {
        color: colors.blue,
        fontSize: scale(16),
        fontFamily: AppFonts.poppinsRegular
    },
    centerView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    leftBtnIcon: {
        color: colors.blue,
        fontSize: scale(16)
    },
    leftBtnText: {
        fontFamily: AppFonts.poppinsRegular,
        fontSize: scale(16),
        color: colors.blue,
    }
});

export default AppHeader;
