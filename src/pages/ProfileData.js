import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    FlatList,
    View,
    TouchableOpacity,
    AsyncStorage,
    Modal
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
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
import { NavigateChildRoute, NavigateParentRoute, GenerateParam } from '../utils/Global';
import { Container, Content } from "native-base";
import withHome from "../redux/Dashboard/action";
import withLoader from '../redux/Loader/action';
import withLogin from '../redux/Login/action';
import { persistor, store } from '../redux/store';
import { resetHomeList, resetProductList, resetReceipeList, resetProfile } from "../redux/Dashboard/action";
import { resetLogin } from "../redux/Login/action";

const itemList = [
    { title: 'Payment Methods', key: 1 },
    { title: 'Delivery Address', key: 2 },
    { title: 'Preferences', key: 3 },
]

class Profile extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isPaymentMethodSelected: false,
            isDeliveryMethodSelected: false,
            isPreferenceSelected: false,
            searchText: '',
            currentAddress: "",
            locationData: [],
            locationName: "",
            locationObj: {},
            connection_Status: false,
            editProfile: false,
            profile_pic: null,
        }
        this.name = '';
        this.email = '';
        this.response = '';
        this.newImage;
    }

    componentDidMount = async () => {
        this._loadData();
    }

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.newImage = response;
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    profile_pic: { uri: response.uri }
                });
                const { user: { first_name, last_name, email, profile_pic } } = this.props.viewProfileData;
                this._updateProfile({ first_name, last_name }, false);
            }
        });
    }

    _loadData = async (refresh = false) => {
        try {
            const { viewProfileData, viewProfile, setLoader, loginData } = this.props;
            console.log('viewProfileData', viewProfileData)
            if ((viewProfileData == null || viewProfileData.success === false) || refresh) {
                const token = loginData.data._token;
                await setLoader(true);
                const params = `oauth_token=${token}`;
                const res = await viewProfile(params, 'profile');
                await setLoader(false);
                console.log('innn', res)
                setTimeout(() => {
                    const { user: { first_name, last_name, email, profile_pic } } = res;
                    this.name = first_name + ' ' + last_name;
                    this.email = email;
                    if (profile_pic.length && profile_pic[0]) {
                        this.setState({
                            profile_pic: { uri: profile_pic[0] }
                        })
                    }
                    this.forceUpdate();
                }, 500)

            } else {
                const { user: { first_name, last_name, email, profile_pic } } = viewProfileData;
                this.name = first_name + ' ' + last_name;
                this.email = email;
                if (profile_pic.length && profile_pic[0]) {
                    this.setState({
                        profile_pic: { uri: profile_pic[0] }
                    })
                }
                this.forceUpdate();
            }
        } catch (error) {
            console.log('Profile', error)
        }
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 2,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                    margin: '1%'
                }}
            />
        );
    };

    selectedOption = (currentScreen) => {
        this.props.selectedOption(currentScreen)
    }

    _renderMenu = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={this.selectedOption.bind(this, item.key)}>
                <View style={{ flex: 1, flexDirection: 'row', paddingVertical: scale(20) }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={profileStyles.list}>{item.title}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Fontisto name='angle-right' style={profileStyles.arrow} />
                    </View>
                </View>
                {this.renderSeparator()}
            </TouchableOpacity>
        )
    }

    _onSignout = async () => {
        await store.dispatch(resetHomeList());
        await store.dispatch(resetProductList());
        await store.dispatch(resetReceipeList());
        await store.dispatch(resetProfile());
        await store.dispatch(resetLogin());
        await AsyncStorage.setItem('addToCart', '');
        setTimeout(() => {
            NavigateParentRoute(this.props, 'Login');
        }, 500)
    }

    _toggleModal = (key) => {
        const { user: { first_name, last_name } } = this.props.viewProfileData;
        this.props.change('first_name', first_name);
        this.props.change('last_name', last_name);
        this.setState({
            [key]: !this.state[key]
        });
    }

    _updateProfile = (formData, showUpdateModal = true) => {
        console.log('_updateProfile', formData);
        if (showUpdateModal) {
            this._toggleModal('editProfile');
        }

        setTimeout(async () => {
            const { updateProfile, setLoader, loginData, userLocation } = this.props;
            try {
                const token = loginData.data._token;
                await setLoader(true);
                const { first_name, last_name } = formData;

                let body = new FormData();
                body.append("oauth_token", token);
                body.append("first_name", first_name);
                body.append("last_name", last_name);
                if (userLocation) {
                    const payloadKey = Object.keys(userLocation.locationobj);
                    console.log('payloadKey', payloadKey)
                    payloadKey.map((item, key) => {
                        body.append(item, userLocation.locationobj[item]);
                    })
                }
                if (this.newImage) {
                    body.append("profile_pic", {
                        uri: this.newImage.uri,
                        type: this.newImage.mime || this.newImage.type || 'image/jpg',
                        name: this.newImage.name || this.newImage.fileName || 'test.jpg',
                    })
                }
                const headers = {
                    'Content-Type': 'multipart/form-data'
                };
                const res = await updateProfile('', 'profile', headers, body);
                if (res.success) {
                    this._loadData(true);
                    this.newImage = null;
                } else {
                    await setLoader(false);
                }
                console.log('innn', res);
            } catch (error) {
                console.log('Profile', error)
                await setLoader(false);

            }
        }, 100)

    }

    render() {
        const { editProfile } = this.state;
        const { handleSubmit } = this.props;
        return (
            <Content contentContainerStyle={{ flex: 1 }}>
                <Modal visible={editProfile} animationType={'slide'} transparent={true} >
                    <TouchableOpacity
                        onPress={this._toggleModal.bind(this, 'editProfile')}
                        activeOpacity={1} style={profileStyles.modalRow}>
                        <View style={profileStyles.modalCol}>
                            <View style={profileStyles.fieldView}>
                                <ReduxField
                                    style={profileStyles.emailField}
                                    name="first_name"
                                    placeholder={'First Name'}
                                    placeholderTextColor={colors.black}
                                />
                                <ReduxField
                                    style={profileStyles.emailField}
                                    name="last_name"
                                    placeholder={'Last Name'}
                                    placeholderTextColor={colors.black}
                                />
                            </View>
                            <View style={profileStyles.signinRow}>
                                <TouchableOpacity
                                    onPress={handleSubmit(this._updateProfile.bind(this))}
                                    style={[AppStyle.blueBtn, { width: '80%', marginTop: scale(10) }]}>
                                    <Text style={AppStyle.blueBtnTxt}>Update Profile</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </TouchableOpacity>
                </Modal>
                <View style={profileStyles.container}>
                    <View style={profileStyles.browseRow}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={profileStyles.browseText}>Profile</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: scale(10) }}>
                            <TouchableOpacity onPress={this._toggleModal.bind(this, 'editProfile')}>
                                <Text style={profileStyles.browseText2}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        position: 'absolute', top: scale(100), padding: scale(20),
                        flex: 1, flexDirection: 'row', ...Layout.shadow, backgroundColor: AppColor.white, borderRadius: 10, marginHorizontal: scale(10)
                    }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ marginVertical: scale(20), flex: 1, flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                                        <Image source={this.state.profile_pic}
                                            style={{ borderRadius: 60, backgroundColor: AppColor.gray, height: scale(60), width: scale(60) }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'column', paddingLeft: scale(10) }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={profileStyles.userName}>{this.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={profileStyles.email}>{this.email}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ marginVertical: scale(20), flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <FlatList
                                        data={itemList}
                                        bounces={false}
                                        renderItem={this._renderMenu}
                                        style={{ height: scale(200) }}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </View>

                            <View style={profileStyles.signinRow}>
                                <TouchableOpacity
                                    onPress={this._onSignout.bind(this)}
                                    style={[AppStyle.blueBtn, { width: '100%' }]}>
                                    <Text style={AppStyle.blueBtnTxt}>Sign Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Content>
        )
    }
}

const validate = values => {
    const error = {};
    if (values.first_name === undefined) {
        error.first_name = 'First Name Required';
    }
    if (values.last_name === undefined) {
        error.last_name = 'Last Name Required';
    }
    return error;
};

const withForm = reduxForm({
    form: 'Profile',
    validate
});

export default withLogin(withLoader(withHome(withForm(Profile))));

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
        fontSize: scale(12),
        color: AppColor.gray,
    },
    signinRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
    fieldView: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 4,

    },
    emailField: {
        width: scale(250),
        height: scale(40),
        marginVertical: scale(5),
        borderBottomWidth: 1,
        fontSize: scale(14),
        fontFamily: AppFonts.poppinsMedium
    },
    modalRow: {
        flex: 1,
        ...Layout.shadow,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalCol: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        height: 'auto',
        padding: scale(30),
        borderRadius: 4
    }
})

