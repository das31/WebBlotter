import {ipAddress} from './apiCredentials'
import {Port} from './apiCredentials'

export const fetchTrades = (tradeFrom, tradeTo) => {
    const url = `http://${ipAddress}:${Port}/trades?trade_dateFROM=${tradeFrom}&trade_dateTO=${tradeTo}`;
    fetch(url, {
      method: "GET"
    }).then(response => response.json()).then(posts => {
        return posts;
      //this.setState({data:posts}, () => console.log(this.state.data) )
    })
}