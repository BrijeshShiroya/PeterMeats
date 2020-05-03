import { createAppContainer } from 'react-navigation';
import { Text, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Location from './pages/Location';
import MobileNumber from './pages/MobileNumber';
import MobileOTP from './pages/MobileOTP';
import React from 'react';
import AppHeader from './common/AppHeader';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Profile from './bottomTabs/Profile';
import Home from './bottomTabs/Home';
import Product from './bottomTabs/Product';
import Recipes from './bottomTabs/Recipes';
import Order from './bottomTabs/Order';
import AppColor from './assets/styles/colors';
import { scale } from './utils/FontScaler';
import Layout from './assets/styles/Layout';
import ProductDetails from './pages/ProductDetails';
import RecipeDetails from './pages/RecipeDetails';
import TabBarComponent from './common/TabBarComponent';
import YourCart from './pages/YourCart';
import CustomerLocation from './bottomTabs/CustomerLocation';
import Signup from './pages/Signup';
import SignupLocation from './pages/SignupLocation';
import SignupMap from './pages/SignupMap';
import DirectionsMap from './pages/DirectionsMap';
import AutoLogin from './pages/AutoLogin';

const HomeMain = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: (props) => ({
            // header: () => <AppHeader {...props} route={'Home'} />,
            header: () => null,
        })
    },
    Product: {
        screen: Product,
        navigationOptions: (props) => ({
            header: () => <AppHeader
                {...props}
                route={'Product'}
                backBtn={false}
                customeBackView={<Text style={styles.titleText}>Products</Text>}
            />,
        })
    },
    Orders: {
        screen: Order,
        navigationOptions: (props) => ({
            header: () => null,
        })
    },
    Recipes: {
        screen: Recipes,
        navigationOptions: (props) => ({
            header: () => <AppHeader
                {...props}
                route={'Recipes'}
                backBtn={false}
                customeBackView={<Text style={styles.titleText}>Recipes</Text>}
            />,
        })
    },
    Profile: {
        screen: Profile,
        navigationOptions: (props) => ({
            // header: () => <AppHeader {...props} route={'Profile'} />,
            header: () => null,
        })
    },
    CustomerLocation: {
        screen: CustomerLocation,
        navigationOptions: (props) => ({
            header: () => null,
        })
    },
    DirectionsMap: {
        screen: DirectionsMap,
        navigationOptions: (props) => ({
            header: () => null,
        })
    },
},
    {
        initialRouteName: __DEV__ ? 'Home' : 'Home',

    }
);

const footTabIcon = (params) => {
    const { focused, horizontal = false, tintColor = false } = params;
    return {
        fontSize: scale(20),
        margin: scale(10),
        // height: '100%',
        paddingTop: scale(4),
        color: focused ? AppColor.blue : AppColor.gray
    }
}

const BottomTabs = createBottomTabNavigator(
    {
        BottomTabs: {
            screen: HomeMain,
            // navigationOptions: {
            //     tabBarLabel: 'Home',
            //     tabBarIcon: (params) => {
            //         return <Entypo style={footTabIcon(params)} name={'home'} />
            //     },
            // },
        },
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                return null;
            },
        }),
        tabBarOptions: {
            activeTintColor: AppColor.blue,
            inactiveTintColor: AppColor.gray,
            labelStyle: {
                fontSize: scale(14),
                height: 'auto'

            },
            style: {
                backgroundColor: AppColor.white,
                ...Layout.shadow
            }
        },
        // initialRouteName: 'Recipes',
        tabBarComponent: ({ navigation }) => <TabBarComponent navigation={navigation} />,
    }
);

const MainNavigator = createStackNavigator({
    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: (props) => ({
            header: () => <AppHeader noFilter={false} {...props} route={'Login'} />,
        })
    },
    MobileNumber: {
        screen: MobileNumber,
        navigationOptions: (props) => ({
            header: () => <AppHeader noFilter={false} {...props} route={'SignupLocation'} />,
        })
    },
    MobileOTP: {
        screen: MobileOTP,
        navigationOptions: (props) => ({
            header: () => <AppHeader noFilter={false} {...props} route={'MobileNumber'} />,
        })
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: () => null,
        }
    },
    Signup: {
        screen: Signup,
        navigationOptions: (props) => ({
            header: () => <AppHeader noFilter={false} {...props} route={'Login'} />,
        })
    },
    SignupLocation: {
        screen: SignupLocation,
        navigationOptions: (props) => ({
            header: () => <AppHeader noFilter={false} {...props} route={'Signup'} />,
        })
    },
    SignupMap: {
        screen: SignupMap,
        navigationOptions: (props) => ({
            header: () => null,
        })
    },
    Location: {
        screen: Location,
        navigationOptions: {
            header: () => null,
        }
    },
    Dashboard: {
        screen: BottomTabs,
        navigationOptions: (props) => ({
            header: () => null,
        })
    },
    ProductDetails: {
        screen: ProductDetails,
        navigationOptions: (props) => ({
            header: () => null,
        })
    },
    RecipeDetails: {
        screen: RecipeDetails,
        navigationOptions: (props) => ({
            header: () => null,
        })
    },
    YourCart: {
        screen: YourCart,
        navigationOptions: (props) => ({
            header: () => null,
        })
    },
    AutoLogin: {
        screen: AutoLogin,
        navigationOptions: {
            header: () => null,
        }
    },

},
    {
        initialRouteName: __DEV__ ? 'AutoLogin' : 'AutoLogin',
        // headerMode: 'none',
        // navigationOptions: {
        //     headerVisible: true,
        // }
    }
);

const Routes = createAppContainer(MainNavigator);

const styles = StyleSheet.create({
    titleText: {
        color: AppColor.blue,
        fontSize: scale(16),
        fontFamily: AppFonts.poppinsRegular
    }
})

export default Routes;
