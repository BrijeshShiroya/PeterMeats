
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    AsyncStorage,
    MaskedViewIOS
} from 'react-native';
import { scale } from '../utils/FontScaler';
import colors from "../assets/styles/colors";
import CheckBox from '../common/CheckBox';
import PlusMinus from '../common/PlusMinus';
import withProduct from '../redux/Dashboard/action';
import withLoader from '../redux/Loader/action';
import withLogin from '../redux/Login/action';
import BackBtn from '../controls/BackBtn';
import { NavigateChildRoute, NavigateParentRoute } from '../utils/Global';
import Layout from '../assets/styles/Layout';
import { Container, Header, Content, Footer } from 'native-base';
import { reduxForm } from 'redux-form';
import ReduxField from "../common/ReduxField";
import AppFonts from '../assets/fonts/';
import LinearGradient from 'react-native-linear-gradient';
import AppStyle from '../assets/styles/Layout';
import Toast from 'react-native-simple-toast';

let flavour = [
    {
        text: 'Italian',
        value: false
    },
    {
        text: 'Garlic',
        value: false
    }
]
const size = [
    {
        text: '150g',
        value: false
    },
    {
        text: '250g',
        value: false
    }
]


class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 1
        }
        this.selectedProduct = props.navigation.getParam('selectedProduct');
        this.selectedVariation = null;
    }

    componentDidMount = async () => {
        this._callApi();
        let getCartData = await AsyncStorage.getItem('addToCart');
        console.log('getCartData', JSON.parse(getCartData));
    }

    _getVariation = (keyName = 'attribute_size') => {
        const { product } = this.selectedProductData;
        let list = [];
        product.variations.map((item, key) => {
            try {

                const { attributes, display_regular_price, display_price, variation_id } = item;
                if (attributes[keyName]) {
                    list.push({
                        [keyName]: attributes[keyName],
                        variation_id,
                        display_price,
                        display_regular_price,
                        key: attributes[keyName],
                        value: attributes[keyName]
                    })
                }
            } catch (error) {
                return [];
            }
        });
        return list;
    }

    _callApi = async () => {
        try {
            const { getProductDetailsById, loginData, setLoader } = this.props;
            console.log('loginData', loginData)
            await setLoader(true);
            const params = `oauth_token=${loginData.data._token}`;
            console.log('this.selectedProduct', this.selectedProduct)
            const { ID } = this.selectedProduct;
            this.selectedProductData = await getProductDetailsById(params, `products/${ID}/view`);

            this.listSize = this._getVariation('attribute_size');
            let newData = {};
            this.listSize.map((item, key) => {
                newData[item.attribute_size] = item;
            })
            this.listSize = [];
            Object.keys(newData).map((item, key) => {
                this.listSize.push(newData[item])
            })
            console.log('newData', newData)
            this.listType = this._getVariation('attribute_type');
            this.listFlavour = this._getVariation('attribute_flavour');
            const { product: { price } } = this.selectedProductData;
            this.price = price.replace("$", "");
            this.perHeadPrice = this.price;
            console.log('this.price', this.price)

            await setLoader(false);
        } catch (error) {
            console.log('error', error)
            await setLoader(false);
        }
    }

    getValue = (quantity) => {
        this.price = (this.perHeadPrice * quantity).toFixed(2);
        this.setState({
            quantity
        });
    }

    _getCheckValue = (value, index, data) => {
        try {
            console.log('_getCheckValue', value, index, data)
            this.price = data['display_price'];
            this.selectedVariation = data;
            console.log('this.price', this.price)
            this.price = this.price.replace("$", "");
            this.perHeadPrice = this.price;
            this.setState({
                quantity: 1
            })
        } catch (error) {
            console.log('_getCheckValue', error)
        }
    }

    _onPress = () => {
        NavigateChildRoute(this.props, 'Dashboard', 'Product')
    }

    _addToCart = async () => {
        console.log('this.selectedProductData', this.selectedProductData)
        let getCartData = await AsyncStorage.getItem('addToCart');
        getCartData = (getCartData) ? JSON.parse(getCartData) : [];
        console.log('getCartData', getCartData)

        const { quantity } = this.state;
        const newItem = { selectedVariation: this.selectedVariation, quantity, product: this.selectedProductData.product };
        console.log('newItem', newItem, 'getCartData', getCartData)
        getCartData = [...getCartData, newItem];
        await AsyncStorage.setItem('addToCart', JSON.stringify(getCartData));
        global.loadViewCartBtn = true;
        Toast.show('Added to cart');
        // NavigateParentRoute(this.props, 'YourCart');
    }

    render() {
        const { quantity } = this.state;
        if (!this.selectedProductData) {
            return null;
        }

        const { product: { image, name, description, price, variations = [] } } = this.selectedProductData;
        console.log('this.listSize', this.listSize)
        return (
            <Container>
                <Content>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <ImageBackground source={{ uri: image }} style={styles.image}>
                                <LinearGradient
                                    start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 3.0 }}
                                    locations={[0, 0.5, 0.3]}
                                    colors={['rgba(0,0,0,0.7)', 'rgba(255,255,255,0.7)']}
                                    style={[styles.image]}>
                                </LinearGradient>
                                <View style={{ position: 'absolute', top: scale(5), left: scale(5) }}>
                                    <BackBtn onPress={this._onPress} />
                                </View>
                            </ImageBackground>
                        </View>


                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(10) }}>
                            <View style={styles.textRow}>
                                <View style={styles.textCol}>
                                    <Text style={styles.title}>{name}</Text>
                                </View>
                            </View>
                            <View style={[styles.textRow, { paddingBottom: scale(2) }]}>
                                <View style={[styles.textCol,]}>
                                    <Text style={styles.subTitle}>DESCRIPTION</Text>
                                </View>
                            </View>
                            <View style={styles.textRow}>
                                <View style={styles.textCol}>
                                    <Text style={styles.disc}>{description}</Text>
                                </View>
                            </View>
                            {
                                this.listSize.length
                                    ?
                                    <View>
                                        <View style={[styles.textRow, { paddingVertical: 0 }]}>
                                            <View style={[styles.textCol,]}>
                                                <Text style={styles.subTitle}>SIZE</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.textRow, { paddingVertical: 0 }]}>
                                            <View style={{ flexDirection: 'column', width: '100%' }}>
                                                <ReduxField
                                                    inputType={'dropdown'}
                                                    name={'size'}
                                                    data={this.listSize}
                                                    callBack={this._getCheckValue}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    : null
                            }
                            {
                                this.listType.length
                                    ?
                                    <View>
                                        <View style={[styles.textRow, { paddingVertical: 0 }]}>
                                            <View style={[styles.textCol,]}>
                                                <Text style={styles.subTitle}>TYPE</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.textRow, { paddingVertical: 0 }]}>
                                            <View style={{ flexDirection: 'column', width: '100%' }}>
                                                <ReduxField
                                                    inputType={'dropdown'}
                                                    name={'type'}
                                                    data={this.listType}
                                                    callBack={this._getCheckValue}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    : null
                            }
                            {
                                this.listFlavour.length
                                    ?
                                    <View>
                                        <View style={[styles.textRow, { paddingVertical: 0 }]}>
                                            <View style={[styles.textCol,]}>
                                                <Text style={styles.subTitle}>FLAVOUR</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.textRow, { paddingVertical: 0 }]}>
                                            <View style={{ flexDirection: 'column', width: '100%' }}>
                                                <ReduxField
                                                    inputType={'dropdown'}
                                                    name={'flavour'}
                                                    data={this.listFlavour}
                                                    callBack={this._getCheckValue}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    : null
                            }
                            <View style={[styles.textRow, { paddingBottom: scale(2) }]}>
                                <View style={[styles.textCol,]}>
                                    <Text style={styles.subTitle}>QUANTITY</Text>
                                </View>
                            </View>

                            <View style={{ height: 'auto', flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: scale(16) }}>{quantity} Item</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <PlusMinus key={quantity} getValue={this.getValue} setValue={quantity} maxValue={10} />
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingTop: scale(20), paddingHorizontal: scale(20), flexDirection: 'row', flex: 1, marginBottom: scale(10) }}>
                            <TouchableOpacity onPress={this._addToCart.bind(this)} style={[AppStyle.blueBtn, { flexDirection: 'row', width: '100%' }]}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', paddingHorizontal: scale(10) }} />
                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center', paddingHorizontal: scale(10) }}>
                                    <Text style={AppStyle.blueBtnTxt}>Add to Cart </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end', paddingHorizontal: scale(10) }}>
                                    <Text style={AppStyle.blueBtnTxt}>${this.price}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Content>
            </Container>
        )
    }
}

const withForm = reduxForm({
    form: 'ProductDetailsForm'
});

export default withLogin(withLoader(withProduct(withForm(ProductDetails))));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(24),
        textAlign: 'left',
        fontFamily: AppFonts.AlegreyaBold
    },
    subTitle: {
        fontSize: scale(16),
        textAlign: 'left',
        fontFamily: AppFonts.poppinsSemiBold
    },
    disc: {
        fontSize: scale(14),
        color: colors.darkgrey,
        fontFamily: AppFonts.poppinsRegular
    },
    textCol: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textRow: {
        flexDirection: 'row',
        paddingVertical: scale(7)
    },
    image: {
        height: scale(200),
        width: '100%',
        // paddingTop: scale(10)
    }
})