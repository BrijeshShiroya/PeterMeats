import { reducer as formReducer } from 'redux-form';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import LoaderReducer from './Loader/reducer';
import LoginReducer from './Login/reducer';
import HomeReducer from './Dashboard/reducer';
import ProductReducer from './Dashboard/reducer';
import ReceipeReducer from './Dashboard/reducer';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'LoginReducer',
        'ProductReducer',
        'HomeReducer',
        'ReceipeReducer',
        'ProfileReducer',
        'CardReducer'
    ]
};

const reducers = combineReducers({
    form: formReducer,
    LoaderReducer,
    LoginReducer,
    ProductReducer,
    ReceipeReducer,
    ...HomeReducer
});
const persistedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducer, {}, compose(applyMiddleware(thunk)));
let persistor = persistStore(store);

export {
    store,
    persistor,
};