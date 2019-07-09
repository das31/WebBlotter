import React, { Component } from 'react';
import './App.css';
import "react-table/react-table.css";
import _ from "lodash";
import Blotter from './Blotter'
import AgBlotter from './Components/Blotters/agBlotter'
import TopStrip from './Components/TopStrip/TopStrip'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {fetchTickers, fetchBrokers} from './actions/fetchItems.action'



class App extends Component {
  constructor(props)
  {
    super(props)
    this.state = {
     //user: 'MODonnell'
     user: localStorage.getItem("userName")
    }
  }

  componentWillMount(){
    this.props.fetchTickers();
    this.props.fetchBrokers();
  }

  componentDidMount()
  {
    
  }

  render(){
    console.log(this.props, " from appjs")
    return (
      this.state.user == "adas"? 
      <div>
        <div >
          <TopStrip
          
          />
        </div>
        <div >
          <AgBlotter/>  
        </div>
    </div>
      
      :
      
      <Blotter/>
      )
    }
  }

function mapDispatchToProps(dispatch){
    return{
      fetchBrokers: bindActionCreators(fetchBrokers,dispatch),
      fetchTickers: bindActionCreators(fetchTickers,dispatch)
    }
}
 
function mapStateToProps(state){
    return{
      brokers: state.brokers,
      tickers: state.tickers
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)
//export default App
