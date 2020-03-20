//Store is the container of the state
//Import modules from Redux
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
//import thunk from redux-thunk
import thunk from 'redux-thunk';
//import reducers
import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';

//Initial state of the application
const initialState = {};
//An array of middlewares
const middleware = [thunk];
//Combine the imported reducers
//This is the actual state of the application
const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer,
});
//Create the store
const store = createStore(reducers, initialState, compose(applyMiddleware(
    ...middleware,
    ),window.__REDUX_DEVTOOLS_EXTENSION__ 
        && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

//export the store
export default store;