import rootReducer from "../Redux/index";
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'scandiweb-store',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({ reducer: persistedReducer, middleware: [] });
const persistedStore = persistStore(store);

export default store;
export { persistedStore };
