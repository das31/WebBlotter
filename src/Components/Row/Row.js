import React from "react";


export default class Row extends React.Component{
    
    constructor(Ticker, Price, Action){
        super();
        this.Ticker = Ticker
        this.Price = Price
        this.Action = Action
    }
    
    render(){
        return (
            <h1>{this.Ticker}</h1>
        )
    }
}