import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';


const middleware = [thunk];

export const configureStore = (initialState) => (
    createStore(rootReducer, initialState, applyMiddleware(...middleware))
);
