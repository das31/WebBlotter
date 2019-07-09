import React, { Component,Fragment } from 'react';
import './App.css';
import ReactTable from 'react-table';
import DraggableTable from './Components/DraggableTable'
import "react-table/react-table.css";
import _ from "lodash";
import {isEqual} from "lodash";
import matchSorter from "match-sorter";
import DatePicker from "./Components/DatePickers/MuiDatePicker";
import Button from '@material-ui/core/Button'
import dateformat from 'dateformat';
import Login from './Components/Forms/Login'
import LongMenu from "./Components/Menu/Menu"
import Select from 'react-select'
import AddTrades from './Components/Forms/AddTrades/AddTrades'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import EditTrades from './Components/Forms/EditTrades'
import Copy from './Components/Buttons/Copy'
import {ipAddress} from './api/apiCredentials'
import {Port} from './api/apiCredentials'

class Blotter extends Component {


  state = {
    // isLoaded: true,
    user:"",
    broker:[],
    trades: [],
    data: [],
    pivotBy: [],
    expanded:{},
    numTrades: null,
    loading: true,
    tradeFrom: dateformat(new Date(), "yyyy-mm-dd"),
    tradeTo: dateformat(new Date(), "yyyy-mm-dd"),
    tradeColumnVisible: false,
    showLogin: true,
    tradeClaimed: 0,
    selectedOption:null,
    options:[],
    tickers: [],
    childFormOpen: false,
    showAddTrades:false,
    portfolios:[],
    allocatedTrades:[],
    cellID: 0,
    initialCellValue: 0,
    cellRefComm: [],
    cellRefPric:[]
    
  };

  

  constructor(props){

    super(props)

    this.resetTimer = React.createRef();
    this.renderCommissionEditable = this.renderCommissionEditable.bind(this);
    this.renderPriceEditable = this.renderPriceEditable.bind(this);
    this.onExpandedChange = this.onExpandedChange.bind(this);
  
  
  }


  onExpandedChange(newExpanded){
    this.setState({
      expanded: newExpanded
    });
  }

  postResult = (value, id, column) => {
    const url = `http://${ipAddress}:${Port}/trades/${column.toLowerCase()}/update?${column.toLowerCase()}=${value}&id=${id}`;
    fetch(url,{
      method: "POST"
    })
  }



  //======================================================================= GET DATA =============================================
  fetchResult = () => {
    const url = `http://${ipAddress}:${Port}/trades?trade_dateFROM=${this.state.tradeFrom}&trade_dateTO=${this.state.tradeTo}`;
    fetch(url, {
      method: "GET"
    }).then(response => response.json()).then(posts => {
      this.setState({data:posts})
      this.setState({numTrades:Number(Object.keys(this.state.data).length)})
      if(this.state.tradeFrom !== this.state.tradeTo){
        this.setState({tradeColumnVisible:true});
      }
      else{
        this.setState({tradeColumnVisible:false});
      }
      this.loading = false;
    })
    this.initializeUser();
  }

  refreshData = () => {

    if(this.state.childFormOpen == true)
    {
      return;
    }

    this.setState({cellRefComm: _.uniq(this.state.cellRefComm)})
    this.setState({cellRefPric:  _.uniq(this.state.cellRefPric)})
     
    const url = `http://${ipAddress}:${Port}/trades?trade_dateFROM=${this.state.tradeFrom}&trade_dateTO=${this.state.tradeTo}`;
    fetch(url, {
      method: "GET"
    }).then(response => response.json()).then(posts => {
      this.setState({data:posts}, () => 
      {
        for (var items in this.state.data)
        {
          this.fetchAllocation(items, this.state.data[items])
        }
      }
      )
    })
    console.log(this.state.user)
  }

  getTickers =() => {
    const url = `http://${ipAddress}:${Port}/Ticker`;
    fetch(url, {
      method: "GET"
    })
    .then(response => response.json())
    .then(posts => this.setState({tickers:posts}))
    .then(() => console.log(this.state.tickers))
  }



 componentDidMount(){
    // this.handleDateChange2();
    // this.fetchResult();
    this.setState(() => {
      return (
        {user:localStorage.getItem("userName")}
      )
    });
    this.interval = setInterval(this.refreshData,100000);
 }

//  resetTimer = () => {
//    clearInterval(this.interval)
//  }

 componentWillMount(){
   this.handleDateChange2();
   this.fetchPortfolios();
   this.fetchBrokers();
   this.getTickers();
   this.refreshData();

 }




  //================================================================================ END GET DATA =================================================

  renderPriceEditable(cellInfo) {
    let pricRef = React.createRef()
    return(
      <div 
        
        contentEditable
        suppressContentEditableWarning
        ref={pricRef=> pricRef != null ? this.state.cellRefPric.push(pricRef) : null}

        onKeyPress = {
          e => {
            this.firstMethod(e);
          }
        }

        onFocus ={
          e=> {
              let initialValue =this.state.data[cellInfo.index][cellInfo.column.id]
              this.setState({initialCellValue: initialValue})
          }
        }
        onKeyDown =
        {
          e => {
            if(e.key == "Enter" && this.state.cellRefPric[cellInfo.viewIndex + 1] != undefined)
            { 
              //this.setState({cellRefPric: _.uniq(this.state.cellRefPric)})
              //console.log(this.state.cellRefPric[cellInfo.viewIndex])
              this.state.cellRefPric[cellInfo.viewIndex + 1].focus();
            }
            else if(e.key == "ArrowUp" && this.state.cellRefPric[cellInfo.viewIndex - 1] != undefined)
            {
              //this.setState({cellRefPric: _.uniq(this.state.cellRefPric)})
              //console.log(this.state.cellRefPric[cellInfo.viewIndex])
              this.state.cellRefPric[cellInfo.viewIndex - 1].focus();
            }
            else if(e.key == "ArrowDown" && this.state.cellRefPric[cellInfo.viewIndex + 1] != undefined ) 
            {
              //this.setState({cellRefPric: _.uniq(this.state.cellRefPric)})
              //console.log(this.state.cellRefPric[cellInfo.viewIndex])
              this.state.cellRefPric[cellInfo.viewIndex + 1].focus();
            }
            else if(e.key == "Escape")
            {
               e.target.innerHTML = this.state.initialCellValue
               
            }
            //console.log(e.key)
          }
        }

        onBlur = {e=>{
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;

          if(Number(cellInfo.row.Price) === Number(cellInfo.original.Price)){
            return;
          }
          this.postResult(cellInfo.original.Price,cellInfo.original.ID, cellInfo.column.Header);
          this.setState({initialCellValue:0})
        }}

        dangerouslySetInnerHTML ={{
          __html:this.state.data[cellInfo.index][cellInfo.column.id]
        }}

      />
    )
  }

  firstMethod(e) {
    const re = /^\d*\.?\d*$/g;
    if(!re.test(e.key)) {
      e.preventDefault();
    }
  }




  renderCommissionEditable(cellInfo) {
    let commRef = React.createRef();

    
    return(

      
      <div 
        contentEditable
        suppressContentEditableWarning
        //onLoad={}
        ref={commRef=> commRef != null ? this.state.cellRefComm.push(commRef) : null}
        padding = {0}
        onKeyPress = {
          e => {
            this.firstMethod(e);
          }
        }
        

        onFocus ={
          e=> {
              let initialValue =this.state.data[cellInfo.index][cellInfo.column.id]
              this.setState({initialCellValue: initialValue})
          }
        }

        onKeyDown =
        {
          e => {
            if(e.key == "Enter" && this.state.cellRefComm[cellInfo.viewIndex + 1] != undefined)
            { 
                
              //this.setState({cellRefComm: _.uniq(this.state.cellRefComm)})
              //console.log(this.state.cellRefComm[cellInfo.viewIndex])
              this.state.cellRefComm[cellInfo.viewIndex + 1].focus();
            }
            else if(e.key == "ArrowUp" && this.state.cellRefComm[cellInfo.viewIndex - 1] != undefined)
            {
              //this.setState({cellRefComm: _.uniq(this.state.cellRefComm)})
              //console.log(this.state.cellRefComm[cellInfo.viewIndex])
              this.state.cellRefComm[cellInfo.viewIndex - 1].focus();
            }
            else if(e.key == "ArrowDown" && this.state.cellRefComm[cellInfo.viewIndex + 1] != undefined)
            {
              //this.setState({cellRefComm: _.uniq(this.state.cellRefComm)})
              //console.log(this.state.cellRefComm[cellInfo.viewIndex])
              this.state.cellRefComm[cellInfo.viewIndex + 1].focus();
            }
            else if(e.key == "Escape")
            {
               e.target.innerHTML = this.state.initialCellValue
            }
            //console.log(e.key)
          }
        }

        onBlur = {e=>{

          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;

          if(Number(cellInfo.row.Commission) === Number(cellInfo.original.Commission)){
            return;
          }

          console.log(cellInfo.row.Commission + " " + cellInfo.original.Commission);

          this.postResult(cellInfo.original.Commission,cellInfo.original.ID, cellInfo.column.Header);
          this.setState({initialCellValue:0})
          
        }}

        dangerouslySetInnerHTML ={{
          __html:this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    )
  }


//#region DROPDOWN BROKERS FWACKIN HECK ==========================================================================
  
  fetchBrokers = () =>{
    const url = `http://${ipAddress}:${Port}/Brokers`;
    fetch(url, {
      method:"GET"
    }).then(response => response.json()).then(posts => {
      this.setState(
          //{broker:JSON.stringify(posts).replace(/\"value"/g,"value").replace(/\"label"/g,"label").replace(/\"/g,"'")}
          {broker:posts}
      )
    }).then(() => console.log(this.state.broker), console.log(this.state.options))
    
  }

  brokerValueChanged = (row, props) => {
    console.log(row.original.ID + props.value)
    const url = `http://${ipAddress}:${Port}/trades/broker/update?id=${row.original.ID}&broker=${props.value}`
    console.log(url);
    fetch(url,{
      method: "GET"
    }).then(val => {this.refreshData()});  
  }
  //#endregion

//#region GRAB MA PORTFORIO
fetchPortfolios = () => {
  const url = `http://${ipAddress}:${Port}/Portfolios`;
  fetch(url, {
    method: "GET"
  }).then(response => response.json()).then(posts => {
    this.setState(
      {portfolios:posts}
    )
  }).then(()=>console.log(this.state.portfolios))
}
//#endregion

  returnPendingOrComplete(val){
    if(val.includes("Pending") && val.includes("Complete")){
      return "Pending"
    }
    else if(val.includes("Pending"))
    {
      return "Pending"
    }
    else if(val.includes("In Process")){
      return "In Process"
    }
    else{
      return "Complete"
    }
  }

  fetchAllocation = (pos,rowInfo) => {
    
    var portfolioArray = String(rowInfo.Portfolio).split(", ").map(x => "'" + x + "'")
    var portfolioString = portfolioArray.join(",") 
    var Grp = '%'
    var KString = "K"
    
    //rowInfo = rowInfo.map(x => console.log(x.Ticker))
    //console.log(rowInfo)
    const url = `http://${ipAddress}:${Port}/AllocationNotes?ID=${rowInfo.ID}&Ticker=${rowInfo.Ticker}&Divisor=${1000}&KString=${KString}&Portfolio=${portfolioString}&Grp=${Grp}`;
    //console.log(rowInfo)
  //   fetch(url, {
  //     method: "GET"
  // //ID, Ticker, Divisor, KString, Portfolio, Grp
  //   }).then(response => response.json()).then(posts => {
  //     console.log(posts)

  //     for(var items in posts)
  //     {
  //       var newItem = posts[items].Custo
  //     }
  //    // this.setState({allocatedTrades:posts})
  //   })
  }

  handleDateChange2 = (date) => {
    this.setState({tradeTo:dateformat(date, "yyyy-mm-dd")}, () => {this.fetchResult()});
  };

  handleDateChange1 = (date) => {
    this.setState({tradeFrom:dateformat(date, "yyyy-mm-dd")}, () => {this.fetchResult()})
  };
 
//#region Table Click Handlers and Methods
 handleStatusClick = (state, rowInfo, column) => {


   return{
     onDoubleClick: (e, handleOriginal)=> {

        if(localStorage.getItem("userName") == null || undefined|| "")
        {
          alert("must be signed in to claim trades");
          return;
        }

        console.log(column.id)
        console.log(rowInfo.original.ID, rowInfo.original.Trader)
        if(column.id == "Trader")
        {
         this.setTrader(rowInfo.original.ID, rowInfo.original.Trader, rowInfo.original.Status, rowInfo.index);
        }
        else if(column.id =="Status")
        {
          this.setStatus(rowInfo.original.ID,rowInfo.original.Status,rowInfo.original.Trader, rowInfo.index);
          console.log(rowInfo)
        }
      }
    }
  }
  
  setStatus = (id, status, trader, viewIndex) => {
    let trades = this.state.data;

    //console.log(trades[viewIndex], "from view Index");
    
    
    if(status == "Complete")
    {
      trades[viewIndex].Status = "Pending"
      trades[viewIndex].Trader = this.state.user
      this.setState({})
      const url = `http://${ipAddress}:${Port}/trades/status/update?id=${id}&status=Pending&trader=${this.state.user}`
      console.log(url);
      fetch(url,{
        method: "GET"
      })//.then(val => {this.refreshData()}); 

    }
    else if(status == "Pending")
    {
      trades[viewIndex].Status = "In Process"
      trades[viewIndex].Trader = this.state.user
      this.setState({data:trades})
      const url = `http://${ipAddress}:${Port}/trades/status/update?id=${id}&status=In_Process&trader=${this.state.user}`
      console.log(url);
      fetch(url,{
        method: "GET"
      })//.then(val => {this.refreshData()});      
    }
    else if(status == "In Process")
    {
      trades[viewIndex].Status = "Complete"
      trades[viewIndex].Trader = this.state.user
      this.setState({data:trades})
      const url = `http://${ipAddress}:${Port}/trades/status/update?id=${id}&status=Complete&trader=${this.state.user}`
      console.log(url);
      fetch(url,{
        method: "GET"
      })//.then(val => {this.refreshData()});
    }
  } 

  setTrader = (id, trader, status, index) => {
    let trades = this.state.data;
        
    if(trader.toString().toLowerCase() == this.state.user)
    {
      return;
    }

    if(trader.toString() == "Not Assigned")
    {
      trades[index].Trader = this.state.user
      trades[index].Status = "In Process"
      this.setState({})
      const url = `http://${ipAddress}:${Port}/trades/trader/update?id=${id}&Trader=${this.state.user}`
      console.log(url);
      fetch(url,{
        method: "GET"
      })
    }
    else if(trader.toString() != this.state.user)
    {
      let confirm = window.confirm("Take over this trade?");
      if(!confirm)
      {
        return;
      }
      trades[index].Trader = this.state.user
      trades[index].Status = "In Process"
      this.setState({})
      const url = `http://${ipAddress}:${Port}/trades/trader/update?id=${id}&Trader=${this.state.user}`
      console.log(url);
      fetch(url,{
        method: "GET"
      })
    }
  }

//#endregion

  initializeUser = (param) => {
    this.setState(() => {
      return(
        {user:localStorage.getItem("userName")}
      )
    });
    //console.log(localStorage.getItem("userName"))
    if(localStorage.getItem("userName") != null ) {
      console.log(localStorage.getItem("userName"))
      this.setState(() => {
        return(
          {showLogin: false}
        )
      });
    }
  }


  validateUserName = (userName) => {

    const url = `http://${ipAddress}:${Port}/authentication?user=${userName}`;
    fetch(url, {
      method: "GET"
    }).then(response => response.json()).then(posts => {
      if(posts != ''){
        if(posts[0].user == "modonnell")
        {
          posts[0].user = "MODonnell"
        }
        localStorage.setItem("userName",posts[0].user);
        this.initializeUser();
      }
      else{
        this.setState({user:""});
        this.setState({showLogin:true});
        alert("Invalid username");
      }
    })
  }

  handleLoginClick = (e) => {
    this.validateUserName(e);
    this.setState({showLogin:false});
  }

  handleLogoutClick = () => {
    localStorage.removeItem("userName");
    this.setState(() => {

      return(
        {user:null}
      )
    });
    this.setState({showLogin:true});
  }

  handleDeleteTrade = (rowInfo) => {
    if(window.confirm(`Are you sure you want to delete trade ${rowInfo.original.Ticker} `)){
      const url = `http://${ipAddress}:${Port}/trades/delete?id=${rowInfo.original.ID}`
      console.log(url);
      fetch(url,{
        method: "GET"
      }).then(val =>{ this.refreshData()});  
    }
  }

  render(){
    const{
      data
    } = this.state;

    const column = [
      {
       Header: () =>
       <strong></strong>,
       width: "100%",
       columns: [
         {
           Header: <strong>Id</strong>,
           accessor: "Id",
           show: false       
         },
         {
           Header: <strong>Ticker</strong>,
           accessor: 'Ticker',
           Pivot: row => {
               return row.value;
         },
           filterMethod: (filter, rows) =>
           matchSorter(rows, filter.value, {keys: ["Ticker"]}),
           filterAll:true,
           filterable:true,
           width: 100
         },
         {
           Header:<strong>Trade Date</strong>,
           accessor: d => {
             return dateformat(d.Trade_Date,"yyyy-mm-dd")
           },
           id:"Trade_Date",
           filterMethod: (filter, rows) =>
           matchSorter(rows, filter.value, {keys: ["Trade_Date"]}),
           filterAll:true,
           filterable:true,
           width: 100,
           show: this.state.tradeColumnVisible
         },
         {
           getProps:(state,rowInfo) =>{
             if(rowInfo && rowInfo.row){
               return{
                 style:{
                   background:
                     rowInfo.row.Status === "Pending" ? "grey" : null
                     || rowInfo.row.Status ==="Complete"? "#08a377" : null
                     || rowInfo.row.Status === "In Process"? "#eacd19" : null,
                     transition: "all 1s"      
                 }
               };
             } else{
               return {};
             }
           },
           Header: <strong>{"Status"}</strong>,
           accessor: 'Status',
           aggregate: (values) => this.returnPendingOrComplete(values),
           filterMethod: (filter, rows) =>
           matchSorter(rows, filter.value, {keys: ["Status"]}),
           filterAll:true,
           filterable:true,
           width:80,
         },
         {
           getProps:(state,rowInfo) =>{
             if(rowInfo && rowInfo.row){
               return{
                 style:{
                   background:rowInfo.row.Shares < 0 ? "salmon" : "lightblue"
                 }
               };
             } else{
               return {};
             }
           },
           Header: 'Shares',
           accessor: 'Shares',
           aggregate: (values, rows) => _.sum(values),
           width: 100
         },
         {
           Header: 'Action',
           accessor: 'Action',
           aggregate: (values, rows) => _.uniqWith(values,isEqual).join(", "),
           filterMethod: (filter, rows) =>
           matchSorter(rows, filter.value, {keys: ["Action"]}),
           filterAll:true,
           filterable:true,
           width:150
         },
         {
           Header: 'Portfolio',
           accessor: 'Portfolio',
           aggregate: (values, rows) => _.uniqWith(values,isEqual).join(", "),
           width: 400,
           filterMethod: (filter, rows) =>
           matchSorter(rows, filter.value, {keys: ["Portfolio"]}),
           filterAll:true,
           filterable:true,
           foldable:true
         },
         {
           Header: 'Price',
           accessor: 'Price',
           Cell: this.renderPriceEditable,
           width:70,
           getProps:(cellInfo) => {
              return{
                style:{
                  color:"LightGreen"
                }
              }
            }
         },
         {
            Header: "Commission",
            accessor: "Commission",
            aggregate:(values, rows) => _.round(_.mean(values),4),
            Cell: this.renderCommissionEditable,
            width:100,
            getProps:(cellInfo) => {
              return{
                style:{
                  color:"LightGreen"
                }
              }
            }
         },
         {
           Header: 'Broker',
           accessor: 'Broker',
           aggregate: (values, rows) => _.uniqWith(values, isEqual).join(", "),
           filterMethod: (filter, rows) =>
           matchSorter(rows, filter.value, {keys: ["Broker"]}),
           filterAll:true,
           filterable:true,
           width:167,
           getProps: () => {
             return{
               style:{
                 overflow:"Visible",
                 color:"black",
                 fontSize:"12px",
                 padding:"0px"
                }
              }
            },
           Cell: row=>(
            <Select
             //name={row.value}
             defaultInputValue={row.original.Broker}
             onChange={(props) => this.brokerValueChanged(row, props)}
            //onChange={this.handleChange}
             //inputValue={(props) => {return(props.value)}}
             options={this.state.broker}
            
          />
           )
           //show:true
         },
         {
          Header: 'Trader',
          accessor: 'Trader',
          width :120,
          aggregate: (values, rows) => _.uniqWith(values, isEqual).join(", "),
          filterMethod: (filter, rows) =>
             matchSorter(rows, filter.value, {keys: ["Trader"]}),
          filterAll:true,
          filterable: true,
        },
        {
          Header:"",
          accessor: "",
          width: 70,
          getProps: () => {
              return{
                style:{
                  //overflow:"Visible",
                  color:"red",
                  //fontSize:"12px",
                  padding:"2px",
                  paddingTop: "4px"
                  //margin
                }
              }
          },
          Cell: (rowInfo) => {
              return(
                  <Button variant="contained" color="secondary" size="small" onClick={() =>this.handleDeleteTrade(rowInfo)}><DeleteIcon fontSize="small"/></Button>
              )
          },
        },
        {
          Header:"",
          accessor: "",
          width: 70,
          getProps: () => {
              return{
                style:{
                  color:"red",
                  padding:"2px",
                  paddingTop: "4px"
                }
              }
          },
          Cell: (rowInfo) => {
              
            return(
                <EditTrades  
                  opening={() => {this.state.childFormOpen=true; console.log(this.state.childFormOpen)}}
                  closing={() => {this.state.childFormOpen=false; this.refreshData(); console.log(this.state.childFormOpen)}}
                  formOpen={this.props.formOpen}
                  ids={rowInfo.original.ID}
                  action={rowInfo.original.Action} 
                  broker={rowInfo.original.Broker} 
                  shares={rowInfo.original.Shares} 
                  commission={rowInfo.original.Commission} 
                  price={rowInfo.original.Price} 
                  portfolio={rowInfo.original.Portfolio} 
                  ticker={rowInfo.original.Ticker} 
                  tickers={this.state.tickers} 
                  brokers={this.state.broker} 
                  portfolios={this.state.portfolios}
                  trader={rowInfo.original.Trader}
                  trade_date={rowInfo.original.Trade_Date}
                />
                //<Button variant="contained" size="small" color="primary" ><EditIcon fontSize="small"/></Button
            )
          },
        }
      ]
    }
  ]



    return(

      <div>
      <div className='container'>
        <DatePicker 
        label="From: "
        changed={this.handleDateChange1}
        />

        <DatePicker
        label="To: "
        changed={this.handleDateChange2}
        
        />

        {/* <Button 
        variant="contained" 
        style={{margin:10}}
        onClick={this.handleLoginClick}
        
        > Login </Button> */}
         {this.state.showLogin == true?
         
         <Login 
         onClose={this.handleLoginClick}
        
         >
          
         </Login>:<LongMenu onLogout={this.handleLogoutClick}/>}

         {this.state.user == null || ""? null :<div style={{margin:15}}> Welcome {" " + this.state.user}</div>}
         
         <AddTrades
          opening={() => {this.state.childFormOpen=true; console.log(this.state.childFormOpen)}}
          closing={() => { this.state.childFormOpen=false;this.refreshData(); console.log(this.state.childFormOpen)}} 
          tickers={this.state.tickers}
          brokers={this.state.broker}/>

         <Copy data={this.state.data}/>
      </div>

      <ReactTable
        getTableProps={() => {
          //console.log(column)
         return {
           style: {
               background : "#353434",
               color: "white",
               textAlign:"center",
               height: "800px",
              }
            }
          }
        }
        data={data}
        //getProps={(column)=> {console.log(column)}}
        //filterable
        defaultFilterMethod={(filter,row) =>
          String(row[filter.id]) === filter.value
        }
        pivotBy={[]}
        onPageChange={pageIndex =>{
          this.onExpandedChange({});
        }}
        onPageSizeChange={(pageSize,pageInde) =>
        {
          this.onExpandedChange({});
        }}
        onSortedChange={(newSorted, column, shiftKey) =>
        {
          this.onExpandedChange({});
        }}
        onFilteredChange={(filtered,column) =>{
          this.onExpandedChange({});
        }}
        onExpandedChange={newExpanded => this.onExpandedChange(newExpanded)}
        expanded = {this.state.expanded}
        columns ={column}
        loading = {this.loading}
        noDataText = {"No Trades Found"}
        showPagination = {false}
        //pivotBy = {this.state.pivotBy}
        pageSize = {Number(Object.keys(this.state.data).length)}
        className = "-striped -highlight"
        resizable = {true}
        getTrProps={this.handleAssignTrader}
        getTdProps={this.handleStatusClick}
 
      />
      </div>
    )
  }
}


export default Blotter;
