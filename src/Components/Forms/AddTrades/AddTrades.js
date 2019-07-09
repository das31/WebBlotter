import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select'
import { InputAdornment, TableCell, TableBody } from '@material-ui/core';
import Input from '@material-ui/core/Input'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import DatePicker from '../../../Components/DatePickers/MuiDatePicker'
import ReactTable2 from 'react-table';
import "react-table/react-table.css";
import dateformat from 'dateformat'
import { addDays } from 'date-fns';
import _ from 'lodash';
import {ipAddress} from '../../../api/apiCredentials'
import {Port} from '../../../api/apiCredentials'


export default class FormDialog extends React.Component{
    state = {
        open: false,
        tradeDate:"",
        settlementDate: "",
        username:"",
        value: "",
        tickers: [],
        rowID:1,
        selectedTicker:"",
        selectedAction:"",
        selectedBroker:"",
        price: "",
        commission:"",
        totalShares:"",
        data: [ 
            {  


                portfolio: "",
                shares:"",
                add:"",
                delete:""
            },
        ],
        portfolios: []

    };

    constructor(props){

        super(props)
        this.renderSharesEditable  = this.renderSharesEditable.bind(this);       
        this.handleSharesInputChange = this.handleSharesInputChange.bind(this);
      
    }

    componentWillMount = () => {
        this.fetchPortfolios();

    }
    handleClickOpen = () => {
        this.setState(
            {
                open:true,
                username:localStorage.getItem("userName")
            }
        )
        this.props.opening();
  
    }

    handleClose = () => {
        //this.setState({open:false})
        this.setState({

            open: false,
            username:"",
            value: "",
            tickers: [],
            selectedTicker:"",
            selectedAction:"",
            selectedBroker:"",
            price: 0,
            commission:0,
            totalShares:"",
            data: [ 
                {  

                    portfolio: "",
                    shares:"",
                    add:"",
                    delete:""
                },
            ],
        })
        this.props.closing();
    };

    componentDidMount = () => {
        this.setState({
            tradeDate: dateformat(new Date(), "yyyy-mm-dd"),
            settlementDate: dateformat(addDays(new Date(), 2), "yyyy-mm-dd"),
            username: localStorage.getItem("userName")
        })
        console.log(this.state.username)
    }


    handleSubmit = () => {

        if(this.state.selectedAction == ""){
            alert("Please select an Action for this trade");
            return
        }
        
        if(this.state.totalShares == 0) {
            alert("Please select a valid Share amount for this trade");
            return;
        }

        if(this.state.selectedTicker == "") {
            alert("Please select a Ticker for this trade");
            return;
        }
        
        if(this.state.username == null){
            alert("Must be signed in to add Trades to blotter")
        }

        let allocations = this.state.data;

        let allocatedSharesSum =0;



        for (var alloc in allocations) {
            if(allocations[alloc].portfolio == "" || allocations[alloc].portfolio == null || Number(allocations[alloc].shares) == 0){
                continue;
            }
            else 
            {
                allocatedSharesSum = allocatedSharesSum + Number(allocations[alloc].shares)
            }
        }

        if(allocatedSharesSum !== Number(this.state.totalShares))
        {
            alert("Allocated shares do not match with total shares, please revise");
            return;
        }

        for(var alloc in allocations)
        {
            const url = `http://${ipAddress}:${Port}/trades/add?Issuer=${this.state.username}&Trade_Date=${this.state.tradeDate}&Ticker=${this.state.selectedTicker}&Portfolio=${allocations[alloc].portfolio}&Shares=${allocations[alloc].shares}&Action=${this.state.selectedAction}&Price=${this.state.price}&Commission=${this.state.commission}&Broker=${this.state.selectedBroker}&Trader=${this.state.username}`;
            fetch(url, {
              method: "GET"
            }).then(posts => this.handleClose())
        }

        console.log(allocatedSharesSum, this.state.totalShares)

        console.log(this.state)
    }

    handleAdd = () => {
        this.setState({open:false})
        this.props.onClose(this.state.username);
    }

//#region  FUNCTIONS TO HANDLE FIELD CHANGES

    handleDateChange1 = (date) => {
        this.setState({tradeDate: dateformat(date, "yyyy-mm-dd")});
    }

    handleDateChange2 = (date) => {
        this.setState({settlementDate: dateformat(date, "yyyy-mm-dd")});
    }

    handleTotalSharesChange = (e) => {
        //this.setState({totalShares: e.target.value})

        if(String(this.state.selectedAction).includes("SELL"))
        {
            this.setState({totalShares:Math.abs(Number(e.target.value)) * -1})
        }
        else
        {
            this.setState({totalShares:Math.abs(Number(e.target.value))})
        }
    }

    handlePriceChange = (e) => {
        this.setState({price: e.target.value})
    }
    handleCommissionChange = (e) => {
        this.setState({commission: e.target.value})
        
    }

    handleTickerChange = (val) => {
        this.setState({
            selectedTicker: val.value
        })
    }
    handleActionChange =(val) => {
        this.setState({
            selectedAction:val.value
        }, () => console.log(this.state.selectedAction))
        let editor = _.cloneDeep(this.state.data)

        if(String(val.value).includes("SELL"))
        {
            this.setState({totalShares: Math.abs(Number(this.state.totalShares)) * -1})

            for(var items in editor)
            {
                editor[items].shares = Math.abs(Number(editor[items].shares)) * -1
            }
            this.setState({data:editor}, () => console.log(this.state.data))

        }
        else
        {
            this.setState({totalShares:Math.abs(Number(this.state.totalShares))})
            
            for(var items in editor)
            {
                editor[items].shares = Math.abs(Number(editor[items].shares))
            }
            this.setState({data:editor})

        }

    }
    handleBrokerChange =(val) => {
        this.setState({
            selectedBroker:val.value
        })
    }

    handleSharesInputChange(e) {

       // console.log(this.state.selectedAction)


        if(String(this.state.selectedAction).includes("SELL"))
        {
            this.setState({totalShares:Math.abs(Number(e.target.value)) * -1})
        }
        else
        {
            this.setState({totalShares:Math.abs(Number(e.target.value))})
        }
    }
//#endregion =============================
    createDate = (portfolio, shares) => {
        return {portfolio, shares}
    }

    handleAddAllocation=() => {
        let states = this.state.data
        console.log(states)
        states.push(
            {   
                 portfolio: "",
                 shares:"",
                 add:"",
                 delete:""
            }                                   

        )
        //console.log(states)
        this.setState({data:states})

    }

    handleDeleteAllocation = (cellInfo) => {
        let states = this.state.data
        if(cellInfo.viewIndex !=0){
            states.splice(cellInfo.viewIndex, 1);
            this.setState({data:states}) 
        }

        console.log(states, cellInfo)

    }

    handlePortfolioSelected = (props,val) => {
        let states = [...this.state.data]
        states[props.row._index].portfolio = val.value;
        this.setState({data: states})
    }


    handleInputChanged = (props,val) => {
        let states = [...this.state.data]
        console.log(props,val)
        //states[props.row._index].portfolio = val.value;
        //this.setState({data: states})
    }


    
    handleAllocationShareValueChanged = (val) => {
        let allocations = this.state.data;
        let allocatedSharesSum =0;

        for (var alloc in allocations) {
            if(Number(allocations[alloc].shares) == 0){
                continue;
            }
            else 
            {
                allocatedSharesSum = allocatedSharesSum + Number(allocations[alloc].shares)
            }
        }

        this.setState({totalShares: allocatedSharesSum}, () => console.log(this.state.totalShares))
    }
    renderSharesEditable(cellInfo) {
        return(
          <div width={'100%'}
            //style={{Color}}
            contentEditable
            suppressContentEditableWarning
            

            onKeyPress = {
                e => {
                  this.firstMethod(e);
                }
            }

            onBlur = {e=>{
    
              let data = [...this.state.data];
              console.log(e.target.innerHTML)


                if(String(this.state.selectedAction).includes("SELL")) {
                    data[cellInfo.index][cellInfo.column.id] = Math.abs(Number(e.target.innerHTML))* -1;
                }
                else{ 
                    data[cellInfo.index][cellInfo.column.id] = Math.abs(Number(e.target.innerHTML));
                }
              //data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
              //console.log(cellInfo.row.Commission + " " + cellInfo.original.Commission);
              this.handleAllocationShareValueChanged()
              this.setState({data});
              console.log(this.state.data)
              console.log(data)
              //this.setState({data})
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
    

    fetchPortfolios = () => {
        const url = `http://${ipAddress}:${Port}/Portfolios`;
        fetch(url, {
            method: "GET"
        }).then(response => response.json()).then(posts => {
            this.setState({portfolios:posts})})
    }


    render (){

        const {
            tickers
        } = this.state;
    //#region COLUMNS
        const columns =[{
            width: 400,
            columns: [
                {
                    Header: <strong>Portfolio</strong>,
                    accessor: "portfolio",
                    width: 200,
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
                            defaultInputValue={row.original.portfolio}
                            options={this.state.portfolios}
                            onChange={(props) => this.handlePortfolioSelected(row, props)}
                        />
                    )
                
                },
                {
                    Header: <strong>Shares</strong>,
                    accessor: 'shares',
                    width: 200,
                    // Cell:row => (
                    // <Input    
                    //     onBlur={(e) => this.handleInputChanged(e, row)}
                    
                    getProps:(cellInfo) => {
                        return{
                          style:{
                            padding: "9px",
                            fontSize: "20"
                          }
                        }
                    },
                    // /> 
                    Cell:this.renderSharesEditable
                },
                {
                    Header:"",
                    accessor: "add",
                    width: 45,
                    getProps: () => {
                        return{
                          style:{
                            //overflow:"Visible",
                            color:"black",
                            //fontSize:"12px",
                            padding:"0px"
                          }
                        }
                    },
                    Cell: () => {
                        return(
                            <IconButton onClick={this.handleAddAllocation}><AddIcon fontSize="small"/></IconButton>
                        )
                    }
                },
                {
                    Header:"",
                    accessor: "delete",
                    width: 45,
                    getProps: () => {
                        return{
                          style:{
                            //overflow:"Visible",
                            color:"black",
                            //fontSize:"12px",
                            padding:"0px"
                          }
                        }
                    },
                    Cell: (cellInfo) => {
                        
                        return(
                            <IconButton onClick={() => this.handleDeleteAllocation(cellInfo)}><DeleteIcon fontSize="small"/></IconButton>
                        )
                    }

                }
            ]
        }]
//#endregion
        const NullComponent = () => null;

        return(
            <Fragment>

                 <div>

                    <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={this.handleClickOpen} 
                    style={{margin:10}}
                    >
                        Add Trade
                    </Button>
                    <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    maxWidth="md"
                    fullWidth={true}
                    display='flex'
                    width ='fit-content'
                    >
                    
                    <DialogTitle id="form-dialog-title"> Add Trade </DialogTitle>
                    
                    <DialogContent style={{flex:"100 0 auto"}} >
                        {/* <div className="container">
                        &nbsp; Select Ticker
                        </div>
                         */}

                         <div>
                            &nbsp;
                            &nbsp;
                            <DatePicker 
                                initialDate ={new Date()}
                                label="Trade Date "
                                changed={this.handleDateChange1}
                                
                            />
                            &nbsp;
                            &nbsp;
                            <DatePicker
                                initialDate = {addDays(new Date(),2)}
                                label="Settlement Date "
                                changed={this.handleDateChange2}
                               

                            />
                         </div>

                        <br/>

                        <div className="container" >
                            <div style={{padding:"10px"}}> Ticker: </div>
                            <div style={{width:180}}>   
                                <Select
                                //name={row.value}
                                onChange={this.handleTickerChange}
                                defaultInputValue={this.state.selectedTicker}
                                //value=""
                                style={{
                                    width:"80%",
                                    display:"flex"
                                }}
                                autoSize
                                name="Tickers"
                                options={this.props.tickers}
                                placeholder="Select Ticker..."
                                />
                            </div>
                            &nbsp;
                            &nbsp;
                            <div style={{padding:"10px"}}> Action: </div>
                            <div style={{width:180}}>   
                                <Select
                                //name={row.value}
                                onChange={this.handleActionChange}
                                defaultInputValue={this.state.selectedAction}
                                //isSearchable
                                style={{
                                    width:"80%",
                                    display:"flex"
                                }}
                                autoSize
                                name="Action"
                                options={[
                                    {value:"BUY", label:"BUY"},
                                    {value:"BUY COVER", label:"BUY COVER"},
                                    {value:"SELL", label:"SELL"},
                                    {value:"SHORT SELL", label:"SHORT SELL"},
                                    {value:"SELL TO ZERO", label:"SELL TO ZERO"}
                                ]}
                                placeholder="Select Action.."
                                />
                            </div>
                            &nbsp;
                            &nbsp;

                            <div style={{padding:"10px"}}> Brokers: </div>
                            <div style={{width:180}}>   
                                <Select
                                //name={row.value}
                                onChange={this.handleBrokerChange}
                                defaultInputValue={this.state.selectedBroker}
                                style={{
                                    width:"80%",
                                    display:"flex"
                                }}
                                autoSize
                                name="Brokers"
                                options={this.props.brokers}
                                placeholder="Select Broker.."
                                />
                            </div>
                        </div>
                        <br/>
                        <div className="container">
                                                    
                            <div style={{padding:"10px"}}> Shares: </div>
                            
                            <Input style={{width:"100px"}} onKeyPress = {e => {this.firstMethod(e);}} onChange={this.handleSharesInputChange} value={this.state.totalShares}  onBlur={this.handleTotalSharesChange}></Input>

                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            
                             
                            <div style={{padding:"10px"}}> Price: </div>
                            <Input style={{width:"100px"}} onKeyPress = {e => {this.firstMethod(e);}} onBlur={this.handlePriceChange} startAdornment={<InputAdornment postion="start">$ </InputAdornment>}></Input>

                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                             
                            <div style={{padding:"10px"}}> Commission: </div>
                            <Input style={{width:"100px"}} onKeyPress = {e => {this.firstMethod(e);}} onBlur={this.handleCommissionChange} startAdornment={<InputAdornment postion="start">$</InputAdornment>}></Input>
                        </div>
                        <br/>
                        <div className="container">
                            <ReactTable2
                                data={this.state.data}
                                columns={columns}
                                //className = "-striped -highlight"
                                showPagination = {false}
                                //pageSize={Number(Object.keys(this.state.data)) + 1}
                                //noDataText={null}
                                NoDataComponent = {NullComponent}

                                getTableProps={() => {
                                    //console.log(column)
                                   return {
                                     style: {
                                         //color: "white",
                                         textAlign:"center",
                                         overflow:"Visible",
                                         height: "300px"
                                        }
                                      }
                                    }
                                }
                            >
                            </ReactTable2>
                            &nbsp;
                            <br/>
                                </div>
                            <div>
                        </div>
                    </DialogContent>                
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                    </Dialog>
                </div>
            </Fragment>
        );
    }
}