import React from 'react'
import {AgGridReact} from 'ag-grid-react';
import {columns} from '../Columns/columns'
import {defaultColumnDefs} from '../Columns/columns'
import {fetchTrades} from '../../actions/fetchItems.action';
import {fetchBrokers, fetchTickers} from '../../actions/fetchItems.action';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import Select from 'react-select'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import 'dateformat'
import _ from 'lodash'


class agBlotter extends React.Component {
   
    state = {
       
    }
    constructor(props)
    {
        super(props);
        this.state = {
            data:[],
            tradeFrom:"2019-06-17",
            tradeTo:'2019-06-17',
            columns: columns,
            defaultColDef: defaultColumnDefs,
            columnStateManager: JSON.parse(localStorage.getItem("columnDefs"))
        }
    }

    componentWillMount()
    {
      this.props.fetchTrades(this.state.tradeFrom,this.state.tradeTo)
      //this.props.fetchBrokers();
      //this.props.fetchTickers();
    }


    componentDidMount()
    {
      console.log(this.state.columnStateManager)

     this.interval = setInterval(this.manageColumnState,100000);
    
    }

    onGridReady = (params) => {
    
        console.log(params.columnApi.getColumnState(), "column api")
        //console.log(fixColumnNames(this.state.columnStateManager[0]), "state manager")
        this.params = params
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
        console.log(this.state.columnStateManager[0])
        this.newfunc(this.gridColumnApi, this.state.columnStateManager);
        
       // params.columnApi.setColumnState(this.state.columnStateManager[0]);
    }

    newfunc = (api, state) =>{
      setTimeout(function() {

        console.log("setting column state at start", state)

          api.setColumnState(state)
        
      
      },1000);
    }


    onGridColumnsChanged = (params) => 
    {

      this.state.columnStateManager.push(params.columnApi.getColumnState())

    }

    manageColumnState = () => {

      console.log( this.params.columnApi.getColumnState());
      var newColumnState =this.params.columnApi.getColumnState();
      localStorage.setItem("columnDefs",JSON.stringify(newColumnState))
     //console.log(this.state.columnStateManager[0])
      //this.params.columnApi.setColumnState(this.state.columnStateManager);
      //this.params.columnApi.setColumnState(this.state.columnStateManager[0])
     // this.setState({newColumnState} , () => localStorage.setItem("columnDefs",JSON.stringify(this.state.newColumnState)));
      //  var newColumnState = _.takeRight(fixColumnNames(this.state.columnStateManager))
      //  this.setState({newColumnState} , () => localStorage.setItem("columnDefs",JSON.stringify(this.state.newColumnState)));
      // console.log(this.params.columnApi.getColumnState(), "new column State")
    }
  

    render()
    {
        let columns = [
            {
              headerName:"ID",
              field: "ID",
              sortable:true,
              filter:true, 
              hide: true,
            },
            {
              headerName: "Ticker",
              field: 'Ticker',
              sortable:true,
              filter:true,
              pinned: true,
              //cellStyle : {textAlign:'center'}
            },
            {
              headerName:"Trade Date",
              field: "Trade_Date",
              sortable:true,
              filter:true,
              cellStyle: {textAlign:'center'}
            },
            {
              headerName:"Status",
              field: 'Status',
              sortable:true,
              filter:true,
              cellStyle: function(params){
                if(params.value === 'Complete'){
                  return {color: 'black',backgroundColor:'lightgreen',textAlign:'center'}
                }
                else if(params.value ==='In Process')
                {
                  return {color:'black',backgroundColor:'yellow',textAlign:'center'}
                }
                else {
                  return {color:'white',backgroundColor:'grey',textAlign:'center'}
                }
              }
            },
            {
              headerName: 'Shares',
              field: 'Shares',
              sortable:true,
              filter:true,
              valueFormatter:sharesFormatter,
              cellStyle: {textAlign:'center'}
              
            },
            {
              headerName: 'Action',
              field: 'Action',
              sortable:true,
              filter:true,
              cellStyle: function(params){
                if(String(params.value).includes('SELL')){
                  return {backgroundColor:'#f76a6a',textAlign:'center'}
                }
                else if(String(params.value).includes("BUY")   )
                {
                  return {color:'black',backgroundColor:'lightblue',textAlign:'center'}
                }
                else {
                  return null;
                }
              }
            },
            {
              headerName: 'Portfolio',
              field: 'Portfolio',
              sortable:true,
              filter:true,
              cellStyle: {
                textAlign:'center'
              }
              
            },
            {
              headerName: 'Price',
              field: 'Price',
              sortable:true,
              filter:true,
              editable: true,
              valueFormatter: numberFormatter,
              valueParser: numberParser,
              cellStyle: function(params){
                return {color:'lightgreen',textAlign:'left'}
              }
            },
            {
               headerName: "Commission",
               field: "Commission",
               sortable:true,
               filter:true,
               editable: true,
               valueFormatter: numberFormatter,
               valueParser: numberParser,
               cellStyle: function(params){
                return {color:'lightgreen',textAlign:'left'}
              }
            },
            {
              headerName: 'Broker',
              field: 'Broker',
              sortable:true,
              filter:true,
              editable:true,
              cellEditor: "agSelectCellEditor",
              cellEditorParams: {
                values: extractValues(this.props.brokers)
              },
              cellStyle: {
                textAlign:'center'
              }
              //refdata:this.props.brokers
            },
            {
             headerName: 'Trader',
             field: 'Trader',
             sortable:true,
             filter:true,
             cellStyle: {
               textAlign:'center'
             }
           },
           {
             headerName:"",
             field: "",
             sortable:true,
             filter:true,
           },
           {
             headerName:"",
             field: "",
             sortable:true,
             filter:true,
           }
          ]

        console.log(defaultColumnDefs, "from ag grid")
        return (
            <div
                className="ag-theme-balham-dark"
                style={{
                  width:'100%',
                  height:'1000px',
                 // paddingTop: '55px'
                    // position:'fixed',
                    // top:'0',
                    // bottom:'0',
                    // left:'0',
                    // right:'0',
                }}
            >
                <AgGridReact
                  enterMovesDown={true}
                  enterMovesDownAfterEdit={true}
                  columnDefs={columns}
                  defaultColDef={defaultColumnDefs}
                  animateRows="true"
                  floatingFilter={true}
                  rowData={this.props.trades}
                  onGridReady={this.onGridReady}
                  // onColumnMoved={this.onGridColumnsChanged}
                  // onColumnResized={this.onGridColumnsChanged}
                  
                   // onColumnChan
                >
                </AgGridReact>
            </div>
        )
    }
}

function fixColumnNames (columns) {
  for(var items in columns)
  {
    if(String(columns[items].colId).includes("ID"))
    {
      columns[items].colId = "ID"
    }
    if(String(columns[items].colId).includes("Ticker"))
    {
      columns[items].colId = "Ticker"
    }
    if(String(columns[items].colId).includes("Trade_Date"))
    {
      columns[items].colId = "Trade_Date"
    }
    if(String(columns[items].colId).includes("Status"))
    {
      columns[items].colId = "Status"
    }
    if(String(columns[items].colId).includes("Shares"))
    {
      columns[items].colId = "Shares"
    }
    if(String(columns[items].colId).includes("Action"))
    {
      columns[items].colId = "Action"
    }
    if(String(columns[items].colId).includes("Portfolio"))
    {
      columns[items].colId = "Portfolio"
    }
    if(String(columns[items].colId).includes("Price"))
    {
      columns[items].colId = "Price"
    }
    if(String(columns[items].colId).includes("Price"))
    {
      columns[items].colId = "Price"
    }
    if(String(columns[items].colId).includes("Commission"))
    {
      columns[items].colId = "Commission"
    }
    if(String(columns[items].colId).includes("Broker"))
    {
      columns[items].colId = "Broker"
    }
    if(String(columns[items].colId).includes("Trader"))
    {
      columns[items].colId = "Trader"
    }
    if(String(columns[items].colId).includes("2"))
    {
      columns[items].colId = "0"
    }
    if(String(columns[items].colId).includes("3"))
    {
      columns[items].colId = "1"
    }


  }

  return columns
}

function mapDispatchToProps(dispatch){
    return{
     fetchTrades: bindActionCreators(fetchTrades, dispatch),
    }
}
 
function mapStateToProps(state){
    return{
      trades: state.trades,
      brokers: state.brokers,
      tickers: state.tickers
    }
}


function extractValues (mappings)
{
  //console.log("from external", Object.values(mappings).join())
  return _.map(mappings, 'value')
}



function numberFormatter (params) 
{
  return "\x24 " + formatNumber(params.value)
}


function formatNumber(number) {
  return parseFloat(number.toFixed(4))
  .toString()
  //.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function sharesFormatter(params)
{
  return formatShares(params.value)
}
function formatShares(number){
  return number
  .toString()
  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function numberParser(params){
  return Number(params.newValue);
}

export default connect(mapStateToProps,mapDispatchToProps)(agBlotter);