import todos from './todos.reducers'
import {trades,brokers, tickers} from './fetchItems.reducer'

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    todos,
    trades,
    brokers,
    tickers
})

export default rootReducer