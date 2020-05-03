

import { StackActions, NavigationActions } from 'react-navigation';

export const NavigateChildRoute = (props, parentRoute = 'Dashboard', childRoute, params = {}) => {
    props.navigation.dispatch({
        type: "Navigation/NAVIGATE",
        routeName: parentRoute,
        action: {
            type: "Navigation/REPLACE",
            routeName: childRoute,
            params
        }
    })
}

export const NavigateParentRoute = (props, parentRoute = 'Dashboard', params = {}) => {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: parentRoute, params })],
    });
    props.navigation.dispatch(resetAction);
}

export const GenerateParam = (data) => {
    let params = '';
    Object.keys(data).map((item, key) => {
        if (key === Object.keys(data).length - 1) {
            params += item + '=' + data[item];
        } else {
            params += item + '=' + data[item] + "&";
        }
    })
    return params

}

export const GOOGLE_API_KEY = 'AIzaSyAYyxEGB5J4cZGFf9TWu4N0gy0KQDWtFeI';
export const GOOGLE_API_KEY2 = 'AIzaSyAYyxEGB5J4cZGFf9TWu4N0gy0KQDWtFeI';

