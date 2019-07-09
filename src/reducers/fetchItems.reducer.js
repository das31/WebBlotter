import {FETCH_TRADES, FETCH_TICKERS} from '../actions/fetchItems.action'
import {FETCH_BROKERS} from '../actions/fetchItems.action'

let initialState = [];

export const trades = (state=initialState, action) => {

    switch(action.type){
        case FETCH_TRADES:
            return[...state, ...action.payload]

        default: 
            return state
    }
}

export const brokers = (state=initialState, action) => {

    switch(action.type){
        case FETCH_BROKERS:
            return[...state,...action.payload]
        default: 
            return state 
    }
}

export const tickers = (state=initialState, action) => {
    switch(action.type){
        case FETCH_TICKERS:
            return[...state,...action.payload]
        default:
            return state
    }
}