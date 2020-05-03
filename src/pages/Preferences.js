
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    FlatList,
    View,
    TouchableOpacity
} from 'react-native';
import AppColor from '../assets/styles/colors';
import { scale } from '../utils/FontScaler';
import AppImages from '../assets/images';
import AppStyle from '../assets/styles/Layout';
import colors from "../assets/styles/colors";
import ReduxField from "../common/ReduxField";
import Fontisto from 'react-native-vector-icons/Fontisto';
import AppFonts from '../assets/fonts';
import Layout from '../assets/styles/Layout';
import { reduxForm } from 'redux-form';
import { NavigateChildRoute, NavigateParentRoute } from '../utils/Global';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Dropdown from '../controls/Dropdown';

const itemList = [
    {
        title: 'First Position',
        options: [
            { key: 'products', value: 'Products' },
        ],
    },
    {
        title: 'Second Position',
        options: [
            { key: 'recipes', value: 'Recipes' },
        ],
    },
    {
        title: 'Third Position',
        options: [
            { key: 'butchersBox', value: 'Butchers Box' },
        ],
    },
    {
        title: 'Fourth Position',
        options: [
            { key: 'meals', value: 'Meals' },
        ],
    },
]
class Payment extends Component {

    renderSeparator = () => {
        return (
            <View style={profileStyles.sepatator} />
        );
    };

    _renderMenu = ({ item, index }) => {
        return (
            <TouchableOpacity key={index}>
                <View style={{ flex: 1, flexDirection: 'row', paddingVertical: scale(20) }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={profileStyles.list}>{item.title}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                        <AntDesign name='right' style={profileStyles.arrow} />
                    </View>
                </View>
                {this.renderSeparator()}
            </TouchableOpacity>
        )
    }

    _renderDropDown = ({ item, index }) => {
        const { options } = item;
        return (
            <View style={{ flexDirection: 'column', paddingHorizontal: scale(2) }}>
                <View style={{ flexDirection: 'row', paddingVertical: scale(15) }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={profileStyles.list}>{item.title.toUpperCase()}</Text>
                    </View>
                </View>
                <Dropdown options={options} />
            </View>

        )
    }

    selectedOption = (currentScreen) => {
        this.props.selectedOption(currentScreen)
    }

    render() {
        return (
            <View style={profileStyles.container}>
                <View style={profileStyles.browseRow}>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: scale(10), paddingRight: scale(10) }}>
                        <TouchableOpacity onPress={this.selectedOption.bind(this, 0)}>
                            <Fontisto name={'close-a'} style={profileStyles.closeBtn} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={profileStyles.browseText}>Preference</Text>
                    </View>
                </View>
                <View style={profileStyles.card1}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={profileStyles.list}>{'home screen sections'.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', paddingVertical: scale(5) }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={profileStyles.card}>{'You can manage the positioning of the home screen sections elow'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {this.renderSeparator()}
                        <FlatList
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            style={{ height: scale(300) }}
                            data={itemList}
                            renderItem={this._renderDropDown}
                        />
                        <View style={profileStyles.signinRow}>
                            <TouchableOpacity
                                onPress={() => { }}
                                style={[AppStyle.blueBtn, { width: '100%' }]}>
                                <Text style={AppStyle.blueBtnTxt}>Save Preferences</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </View>
        )
    }

}

export default Payment;

const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: 'transparent'
    },
    browseRow: {
        backgroundColor: AppColor.black,
        flexDirection: 'row',
        width: "100%",
        paddingVertical: scale(15),
        paddingHorizontal: scale(12),
        height: scale(200)
    },
    browseText: {
        fontSize: scale(30),
        color: AppColor.white,
        fontFamily: AppFonts.AlegreyaBold
    },
    browseText2: {
        fontSize: scale(16),
        color: AppColor.white,
        fontFamily: AppFonts.poppinsRegular
    },
    userName: {
        fontSize: scale(16),
        color: AppColor.black,
        fontFamily: AppFonts.poppinsSemiBold
    },
    email: {
        fontSize: scale(14),
        color: AppColor.gray,
        fontFamily: AppFonts.poppinsMedium
    },
    list: {
        fontSize: scale(14),
        color: AppColor.black,
        fontFamily: AppFonts.poppinsMedium
    },
    arrow: {
        fontSize: scale(20),
        color: AppColor.gray,
    },
    signinRow: {
        paddingTop: scale(20),
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    signInBtn: {
        backgroundColor: colors.blue,
        width: '80%',
        height: scale(35),
        justifyContent: 'center',
        borderRadius: 4,
        alignItems: 'center'
    },
    signInBtnTxt: {
        color: colors.white,
        fontSize: scale(16)
    },
    sepatator: {
        height: 2,
        width: "100%",
        backgroundColor: "#CED0CE",
        margin: '1%',
    },
    closeBtn: {
        color: colors.white,
        fontSize: scale(20),
    },
    card1: {
        position: 'absolute',
        top: scale(70),
        padding: scale(20),
        flex: 1,
        flexDirection: 'row',
        ...Layout.shadow,
        backgroundColor: AppColor.white,
        borderRadius: 10,
        marginHorizontal: scale(10)
    },
    card: {
        fontSize: scale(14),
        color: AppColor.gray,
        fontFamily: AppFonts.poppinsRegular
    },
    listItem: {
        fontSize: scale(14),
        color: AppColor.black,
        fontFamily: AppFonts.poppinsRegular
    },
    dropdownArrow: {
        fontSize: scale(20),
        color: AppColor.blue,
    }
})