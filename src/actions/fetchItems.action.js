import {ipAddress} from '../api/apiCredentials'
import {Port} from '../api/apiCredentials'
import dateformat from 'dateformat'

export const FETCH_TRADES = 'FETCH_TRADES'
export const FETCH_BROKERS = 'FETCH_BROKERS'
export const FETCH_TICKERS = 'FETCH_TICKERS'

export const fetchTrades = (tradeFrom, tradeTo) => {
    return (dispatch) => {
        
        fetch(`http://${ipAddress}:${Port}/trades?trade_dateFROM=${tradeFrom}&trade_dateTO=${tradeTo}`, {
            method: "GET"
          }).then(response => response.json()).then(trades => {
            
            for (var i=0; i< Object.keys(trades).length; i++)
            {
                trades[i].Trade_Date = dateformat(trades[i].Trade_Date, "yyyy-mm-dd")
            }

            dispatch({
                type: FETCH_TRADES,
                payload:trades
            })
            //this.setState({data:posts}, () => console.log(this.state.data) )
        })
    }
}

export const fetchBrokers = () => {
    return (dispatch) => {
        const url = `http://${ipAddress}:${Port}/Brokers2`;
        fetch(url, {
        method:"GET"
        }).then(response => response.json()).then(brokers => {

            dispatch({
                type:FETCH_BROKERS,
                payload:brokers
            })
        })
    }
}

export const fetchTickers = () => {
    return (dispatch) => {
        const url = `http://${ipAddress}:${Port}/Ticker`;
        fetch(url, {
            method:"GET"
        }).then(response => response.json()).then(tickers => {
            dispatch({
                type:FETCH_TICKERS,
                payload: tickers
            })
        })
    }
}