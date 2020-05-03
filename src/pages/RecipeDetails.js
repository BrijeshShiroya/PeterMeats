
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    FlatList
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
import { Rating, AirbnbRating } from 'react-native-ratings';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppFonts from '../assets/fonts/';
import LinearGradient from 'react-native-linear-gradient';

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


class RecipeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 1
        }
        this.selectedProduct = props.navigation.getParam('selectedProduct');
    }

    componentDidMount = () => {
        this._callApi();
    }

    _callApi = async () => {
        try {
            const { getProductDetailsById, loginData, setLoader } = this.props;
            console.log('loginData', loginData)
            await setLoader(true);
            const params = `oauth_token=${loginData.data._token}`;
            const { ID } = this.selectedProduct;
            this.selectedProductData = await getProductDetailsById(params, `recipes/${ID}/view`);
            console.log('this.selectedProductData', this.selectedProductData)
            await setLoader(false);
        } catch (error) {
            console.log('error', error)
            await setLoader(false);
        }
    }

    getValue = (quantity) => {
        this.setState({
            quantity
        });
    }

    _getCheckValue = (value, index, fieldName) => {
        fieldName[index].value = value;
        this.forceUpdate();
    }

    _renderFlavour = ({ item, index, fieldName }) => {
        const { text, value } = item;
        return (
            <CheckBox key={index} text={text} value={value} getValue={(value) => { this._getCheckValue(value, index, fieldName) }} />
        )
    }

    _onPress = () => {
        NavigateChildRoute(this.props, 'Dashboard', 'Recipes')
    }

    _renderAllergens = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
                <View style={styles.freeFromView}>
                    <Image source={{ uri: item.icon }} style={{
                        height: scale(30), width: scale(30),
                        tintColor: colors.black
                    }} />
                </View>
                <Text style={{

                    flexDirection: 'row',
                    fontFamily: AppFonts.poppinsRegular,
                    fontSize: scale(12),
                }}>{item.name}</Text>
            </View>
        )
    }

    render() {
        const { quantity } = this.state;
        if (!this.selectedProductData) {
            return null;
        }

        const { recipe: { allergens, ingredients, method, rating, cook_time, servings, name, description, difficulty } } = this.selectedProductData;
        const { image } = this.selectedProduct;
        return (
            <Container>
                <Content>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <ImageBackground source={{ uri: image }} style={styles.image} >
                                <LinearGradient
                                    start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 3.0 }}
                                    locations={[0, 0.5, 0.3]}
                                    colors={['rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)']}
                                    style={styles.image}>
                                </LinearGradient>
                                <View style={{ position: 'absolute', top: scale(5), left: scale(5) }}>
                                    <BackBtn onPress={this._onPress} />
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={styles.textRow}>
                                <View style={styles.textCol}>
                                    <Text style={styles.title}>{name}</Text>
                                </View>
                            </View>
                            <View style={styles.textRow}>
                                <View style={styles.textView} pointerEvents={'none'}>
                                    <Rating
                                        startingValue={rating}
                                        ratingCount={5}
                                        imageSize={15}
                                        style={{ paddingVertical: 10 }}
                                        isDisabled={true}
                                    />
                                </View>
                                <View style={styles.textView}>
                                    <Entypo name={'users'} style={styles.subText} size={scale(12)}  >
                                        <Text style={styles.subText}>{' ' + servings}</Text>
                                    </Entypo>
                                </View>
                                <View style={styles.textView}>
                                    <Feather name={'clock'} style={styles.subText} size={scale(13)}  >
                                        <Text style={styles.subText}>{' ' + cook_time}</Text>
                                    </Feather>
                                </View>
                                <View style={styles.textView}>
                                    <MaterialCommunityIcons style={styles.subText} name={'fire'} size={scale(15)} />
                                    <Text style={styles.subText}>{difficulty}</Text>
                                </View>
                            </View>

                            <View style={[styles.seperator, { width: "100%" }]} />

                            <View style={[styles.textRow, { paddingBottom: scale(2) }]}>
                                <View style={[styles.textCol]}>
                                    <Text style={styles.subTitle}>Free From</Text>
                                </View>
                            </View>
                            <FlatList
                                columnWrapperStyle={{ flex: 1, justifyContent: "flex-start" ,marginLeft:10 }}
                                extraData={JSON.stringify(allergens)}
                                style={{ flex: 1 }}
                                data={allergens}
                                horizontal={false}
                                numColumns={3}
                                renderItem={({ item, index }) => this._renderAllergens({ item, index })}
                            />
                            <View style={[styles.textRow, { paddingBottom: scale(2) }]}>
                                <View style={[styles.textCol]}>
                                    <Text style={styles.subTitle}>INGREDIENTS</Text>
                                </View>
                            </View>
                            {
                                ingredients.map((item, key) => {
                                    const { amount, unit, ingredient } = item;
                                    return (
                                        <View style={{
                                            flexDirection: "column", justifyContent: 'center',
                                            alignItems: 'flex-start',
                                            paddingHorizontal: scale(10)
                                        }}>

                                            <View key={key} style={styles.textRow}>
                                                <View style={[styles.textCol, { flex: 2 }]}>
                                                    <Text style={[styles.ingredient]}>{ingredient}</Text>
                                                </View>
                                                <View style={{ flexDirection: "column" }}>
                                                    <Text style={styles.ingredient}>{amount + unit}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.seperator} />
                                        </View>
                                    )
                                })
                            }
                            <View style={[styles.textRow, { paddingBottom: scale(2) }]}>
                                <View style={[styles.textCol,]}>
                                    <Text style={styles.subTitle}>METHOD</Text>
                                </View>
                            </View>
                            {
                                method.map((item, key) => {
                                    const { description } = item;
                                    return (
                                        <View key={key} style={styles.textRow}>
                                            <View style={styles.textCol}>
                                                <Text style={styles.disc2}>{description}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default withLogin(withLoader(withProduct(RecipeDetails)));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(24),
        textAlign: 'left',
        fontFamily: AppFonts.AlegreyaBold
    },
    subTitle: {
        fontSize: scale(16),
        textAlign: 'left',
        // fontWeight: 'bold'
        fontFamily: AppFonts.poppinsSemiBold
    },
    disc: {
        fontSize: scale(16),
        color: colors.darkgrey,
        fontFamily: AppFonts.poppinsRegular
    },
    disc2: {
        fontSize: scale(14),
        color: colors.darkgrey,
        flexWrap: 'wrap',
        fontFamily: AppFonts.poppinsRegular
    },
    ingredient: {
        fontSize: scale(12),
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
        paddingVertical: scale(7),
        paddingHorizontal: scale(10)
    },
    textView: {
        flexDirection: 'row',
        paddingVertical: scale(5),
        paddingHorizontal: scale(2),
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: scale(200),
        width: '100%',
        // paddingTop: scale(10)
    },
    seperator: {
        height: 1,
        width: "100%",
        backgroundColor: "#CED0CE",
        margin: '1%'
    },
    subText: {
        fontSize: scale(13),
        textAlign: 'left',
        fontFamily: AppFonts.poppinsRegular,
        marginHorizontal: scale(1),
        color: colors.gray
    },
    freeFromView: {
        flexDirection: 'row',
        margin: scale(4),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(25),
        height: scale(50),
        width: scale(50),
        backgroundColor: colors.lightGray2,
    }
})