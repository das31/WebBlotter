import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select'
import {InputAdornment} from '@material-ui/core';
import Input from '@material-ui/core/Input'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import DatePicker from '../../Components/DatePickers/MuiDatePicker'
import ReplayIcon from '@material-ui/icons/Undo'
import ReactTable2 from 'react-table';
import "react-table/react-table.css";
import dateformat from 'dateformat'
import { addDays } from 'date-fns';
import EditIcon from '@material-ui/icons/Edit'
import CallSplit from '@material-ui/icons/CallSplitSharp'
import _ from 'lodash'
import {ipAddress} from '../../api/apiCredentials'
import {Port} from '../../api/apiCredentials'


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
        initialShares: "",
        trader: "",
        splitActive: false,
        data: [ 
            {  
                id: "",
                portfolio: "",
                oldShares:"",
                shares:"",
                add:"",
                delete:""
            },
        ],
        initialData: [
            {  
                id: "",
                portfolio: "",
                shares:"",
                add:"",
                delete:""
            },
        ],
        deletedData: [
            {  
                id: "",
                portfolio: "",
                shares:"",
                add:"",
                delete:""
            },
        ],
        splitData: [
            {
                broker: "",
                shares: "",
                price: "",
                commission: "",
                add: "",
                delete: ""
            }
        ],
        initialSplitData: [
            {   
                broker: "",
                shares: "",
                price: "",
                commission: "",
                add: "",
                delete: ""
            }
        ]
        
        //portfolios: []
    };

    constructor(props){

        super(props)
        this.renderSharesEditable  = this.renderSharesEditable.bind(this);
        this.renderSplitSharesEditable  = this.renderSplitSharesEditable.bind(this);
        this.renderSplitPriceEditable = this.renderSplitPriceEditable.bind(this);
        this.renderSplitCommissionEditable = this.renderSplitCommissionEditable.bind(this);
        this.handleSharesInputChange = this.handleSharesInputChange.bind(this);
        

        this.state = {
            open:false,
            selectedTicker:this.props.ticker,
            selectedAction:this.props.action,
            initialShares:this.props.shares,
            selectedBroker:this.props.broker,
            totalShares:this.props.shares,
            price: this.props.price,
            commission:this.props.commission,
            trader: this.props.trader,
            username :localStorage.getItem("userName"),
            tradeDate: this.props.trade_date,
            deletedData: [],
            splitData: [
                {
                    broker: this.props.selectedBroker,
                    shares: this.props.shares,
                    price: this.props.price,
                    commission: this.props.commission,
                    add: "",
                    delete: ""
                }
            ],
            initialSplitData : 
            [
                {
                    broker:this.props.selectedBroker,
                    shares: this.props.shares,
                    price: this.props.price,
                    commission: this.props.commission,
                    add: "",
                    delete: ""
                }
            ]
        }
    }


    handleClickOpen =() => {

        if(this.state.username == "" || this.state.username == null || this.state.username == undefined)
        {
            alert("Must be logged in to edit trades")
            return
        }

        if(this.state.trader != this.state.username)
        {
            if(this.state.username != 'adas') {
            alert("Must own selected trade")
            return
            }
        }
        // if(this.state.username != 'adas')
        // {
        //     alert("Under Construction!")
        //     return
        // }
        
        this.fetchAllocation()
        this.props.opening();
        this.setState({open:true})
       
    }

    handleClose = () => {
        //this.setState({open:false})
        this.setState({

            open: false,
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
                    id: "",
                    portfolio: "",
                    shares:"",
                    weight: "",
                    add:"",
                    delete:""
                },
            ],
        })
        this.props.closing();
    };

    componentDidMount = () => {
        this.setState({
          tradeDate: dateformat(new Date(this.state.tradeDate), "yyyy-mm-dd"),
          settlementDate: dateformat(addDays(new Date(this.state.tradeDate), 2), "yyyy-mm-dd"),
          username: localStorage.getItem("userName"),
        })
       
    }



    fetchAllocation = () => {
        const url = `http://${ipAddress}:${Port}/Allocatedtrades?id=${this.props.ids}`;
        fetch(url, {
          method: "GET"
        }).then(response => response.json()).then(posts => {
          this.setState(
            {
                data:posts,
                initialData:JSON.parse(JSON.stringify(posts))
            }
          )
        }).then(()=>console.log(this.state.data))
    }

    handleSubmit = () => {

        if(this.state.selectedAction == ""){
            alert("Please select an Action for this trade");
            return
        }
        
        if(this.state.selectedTicker == "") {
            alert("Please select a Ticker for this trade");
            return;
        }
        
        if(this.state.username == null){
            alert("Must be signed in to modify Trades")
        }

        let allocations = this.state.data;
        let deletedAllocations = this.state.deletedData;
        let allocatedSharesSum = 0;

        for (var alloc in deletedAllocations){
            if(Number(Object.keys(deletedAllocations).length) ==0) {
                console.log("no deleted trades");
                continue;
            }
            else
            {
                if(Number(deletedAllocations[alloc].id) < 0) {continue}
                const url = `http://${ipAddress}:${Port}/trades/delete?id=${deletedAllocations[alloc].id}`
                console.log(url);
                fetch(url,{
                method: "GET"
                })
            }
        }

        for (var alloc in allocations) {
            if(allocations[alloc].portfolio == "" || allocations[alloc].portfolio == null || Number(allocations[alloc].shares) == 0){
                continue;
            }
            else 
            {
                allocatedSharesSum = allocatedSharesSum + Number(allocations[alloc].shares)
            }
        }

        console.log(allocatedSharesSum, this.state.totalShares)

        if(Math.abs(allocatedSharesSum)!== Math.abs(Number(this.state.totalShares)))
        {
            alert("Allocated shares do not match with total shares, please revise");
            return;
        }

        for(var alloc in allocations)
        {
            const url = `http://${ipAddress}:${Port}/trades/edit?Ticker=${this.state.selectedTicker}&Action=${this.state.selectedAction}&Brokers=${this.state.selectedBroker}&Shares=${allocations[alloc].shares}&Price=${this.state.price}&Commission=${this.state.commission}&Portfolio=${allocations[alloc].portfolio}&trade_date=${this.state.tradeDate}&settlement_date=${this.state.settlementDate}&Trader=${this.state.username}&ID=${allocations[alloc].id}`

            fetch(url, {
              method: "GET"
            })
        }

        // if(_.isEqual(this.state.splitData,this.state.initialSplitData))
        // {
        //     this.handleClose();
        //     return;
        // }
        // else {
        //     if(this.state.splitActive == true) {
        //        this.handleSplitTradesPending(); 
        //     }
            
        // }
        //console.log(this.state)
        console.log(allocatedSharesSum, this.state.totalShares)
        //console.log(this.state)


        this.handleSplitTradesPending();
        
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
        let newShares = this.state.totalShares
        if(newShares == Number(this.state.initialShares)){
            return
        }

        var oldShares = JSON.parse(JSON.stringify(this.state.initialShares));
        //console.log(this.state.totalShares);
        var allocations = JSON.parse(JSON.stringify(this.state.data))//json();
        
        let accumulator = 0;
        let remainer = 0;

        //console.log(newShares)

        for (var alloc in allocations) {

            if(allocations[alloc].portfolio == "" || allocations[alloc].portfolio == null || Number(allocations[alloc].shares) == 0){
                continue;
            }
            else 
            {   
                allocations[alloc].shares = Math.round(Number(newShares) * (Number(allocations[alloc].shares)/Number(oldShares)))
                
                if(Math.abs(allocations[alloc].shares) > 9999)
                {
                    accumulator= accumulator + Number(allocations[alloc].shares)%1000
                    remainer = Number(allocations[alloc].shares)%1000
                   
                }
                else if(Math.abs(allocations[alloc].shares) > 999){
                    accumulator = accumulator + Number(allocations[alloc].shares)%100
                    remainer = Number(allocations[alloc].shares)%100
                    
                }
                
                allocations[alloc].shares = allocations[alloc].shares - remainer;
                
                if(alloc == Object.keys(allocations).length - 1) {
                    allocations[alloc].shares = allocations[alloc].shares + accumulator
                }
            }
        }
        
        let checker = 0;

        for (var alloc in allocations) {
            if(allocations[alloc].portfolio == "" || allocations[alloc].portfolio == null || Number(allocations[alloc].shares) == 0){
                continue;
            }
            else 
            {  
                checker = checker + allocations[alloc].shares
            }
        }
        console.log(checker)

        let diff = newShares - checker
        allocations[Number(Object.keys(allocations).length -1)].shares += diff; 

        this.setState({initialShares: newShares})
        this.setState({totalShares: e.target.value})
        this.setState({data: allocations})
    }

    adjustAllocations = (oldShares, newShares, allocations) => 
    {
        for (var alloc in allocations) {
            if(allocations[alloc].portfolio == "" || allocations[alloc].portfolio == null || Number(allocations[alloc].shares) == 0){
                continue;
            }
            else 
            {
                allocations[alloc].shares = Number(allocations[alloc].shares) * (Number(oldShares)/Number(newShares))
            }
        }
        return allocations
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
        })
    }
    handleBrokerChange =(val) => {
        this.setState({
            selectedBroker:val.value
        })
    }
//#endregion =============================

    createDate = (portfolio, shares) => {
        return {portfolio, shares}
    }

    handleAddAllocation=() => {
        let states = this.state.data
        console.log(states)
        states.push(
            {    id: "",
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
        let deletedStates = this.state.deletedData

        console.log(deletedStates)
        deletedStates.push(states[cellInfo.viewIndex])
        //console.log("but it works" , states[cellInfo.viewIndex])
        if(cellInfo.viewIndex !=0){
            states.splice(cellInfo.viewIndex, 1);
            this.setState({data:states}) 
        }
        else if(cellInfo.viewIndex == 0 && Object.keys(this.state.data).length >1)
        {
            states.shift();
        }
        else if(cellInfo.viewIndex == 0 && Object.keys(this.state.data).length == 1)
        {
            this.setState(
                {
                    data: [
                        {
                            broker: "",
                            shares: "",
                            price: "",
                            commission: "",
                            add: "",
                            delete: ""
                        }
                    ],
                }
            )
        }


        console.log(states, this.state.initialData, deletedStates)
        this.handleAllocationShareValueChanged();
    }
    handleTableReset = () => {
        this.setState({data:JSON.parse(JSON.stringify(this.state.initialData))},
            this.setState({deletedData:[]},()  =>
                {        
                    let allocations = this.state.initialData;
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
            )
        )
    }

    handlePortfolioSelected = (props,val) => {
        let states = [...this.state.data]
        states[props.row._index].portfolio = val.value;
        this.setState({data: states})
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

    handleSharesInputChange(e) {

        if(String(this.state.selectedAction).includes("SELL"))
        {
            this.setState({totalShares:Math.abs(Number(e.target.value)) * -1})
        }
        else
        {
            this.setState({totalShares:Math.abs(Number(e.target.value))})
        }
    }

//#region RENDER EDITABLE FIELDS FOR TABLE

        renderSharesEditable(cellInfo) {

            return(
            <div 
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
                    data[cellInfo.index][cellInfo.column.id] = Number(e.target.innerHTML)
                }
                
                this.handleAllocationShareValueChanged()
                this.setState({data});
                console.log(this.state.data)
                console.log(data)
                //this.setState({data})
                }}

                dangerouslySetInnerHTML ={{
                    __html:this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
            )
        }
//#endregion



//#region SPLIT SHARE HANDLERS 

    handleOpenSplit = () => {
        if(this.state.splitActive ==true) 
        {
            this.setState(
                {
                    splitActive: false
                }
            )
        }
        else 
        {
            this.setState(
                {
                    splitActive: true,
                    splitData: this.state.initialSplitData
                }
            )
        }
    }
    handleBrokerSelected = (props,val) => {
        let states = [...this.state.splitData]
        states[props.row._index].broker = val.value;
        this.setState({splitData: states})
    }

    nearestHundred = (num, precision) => 
    {
        let val =Math.round(num/precision) * precision
        return val;
        
    }

    handleSplitTradesPending = () => 
    {

        if(this.state.splitActive == false) 
        {
            
            this.handleClose();
            return;
        }

        if(Object.keys(this.state.splitData).length < 2) 
        {
           // console.log("no split trades pending")
           
            this.handleClose();
            return;
        }

        
        let allocations = this.state.splitData;
        let initialInjectionData = _.cloneDeep(this.state.data)
        let totalShares = _.cloneDeep(this.state.totalShares);
        let portfolioString = [];
        let allocatedSharesSum =0;
        let weights = [];

        for (var alloc in allocations)
        {
            if(Number(allocations[alloc].shares == 0))
            {
                continue;
            }
            else
            {
                allocatedSharesSum += allocations[alloc].shares
                weights.push(
                    {
                        weight: Math.abs(Number(allocations[alloc].shares))/Math.abs(Number(this.state.totalShares)),
                        broker: allocations[alloc].broker,
                        price: Number(allocations[alloc].price),
                        commission: Number(allocations[alloc].commission),
                    }
                )
            }
        }
        console.log(weights)
        console.log(allocations)
        
        if(allocatedSharesSum != this.state.totalShares)
        {
            alert("Invalid Shares allocated, Exceeded by: " + (this.state.totalShares - allocatedSharesSum));
            return;
        }
        
        //console.log(_.partition(initialInjectionData, 'portfolio'))
        //portfolioString = 



        for (var alloc in initialInjectionData) {
            if(Number(initialInjectionData[alloc].shares) == 0){
                continue;
            }
            else 
            {
                portfolioString.push("'" + initialInjectionData[alloc].portfolio + "'")
            }
        }
        portfolioString = portfolioString.join(",")
        

        const url = `http://${ipAddress}:${Port}/GetSplitTrades?Ticker=${this.state.selectedTicker}&Action=${this.state.selectedAction}&Portfolio=${portfolioString}&Trade_Date=${this.state.tradeDate}&Price=${this.state.price}&Commission=${this.state.commission}&Broker=${this.state.selectedBroker}`;
        console.log(url)
        let splitID = [];

        fetch(url, {
            method: "GET"
        }).then(response => response.json()).then(posts => {

            console.log(posts, "this is posts")

            let injectionArray =[];
            let precision = 10;
            for(var xz in allocations)
            {
                if(Number(allocations[xz].shares)/2 > 100 &&  Number(allocations[xz].shares)/2 < 1000)
                {
                    precision= 10
                    break
                }
                else if (Number(allocations[xz].shares)/2 > 1000)
                {
                    precision = 100;
                }
                else{
                    precision=1
                }
            }



            for (var x in allocations)
            {   
                var allocated = 0;
                for(var i in posts)
                {
                    injectionArray.push(
                        {
                            id: posts[i].id,
                            portfolio:posts[i].portfolio,
                            broker: allocations[x].broker,
                            shares:  this.nearestHundred(Number(allocations[x].shares  * (posts[i].shares/Number(this.state.totalShares))), precision),
                            price: allocations[x].price == 0 || null || undefined || ""? posts[i].price : allocations[x].price,
                            commission: allocations[x].commission == 0 || null || undefined || ""? 0 : allocations[x].commission,
                            issuer: posts[i].Issuer,
                            splitID: posts[i].id,

                        }
                    )
                }
            }
            
            let accumulator = 0;
            let remainer = 0;
            console.log(injectionArray, " supposed to be injection array")

            // for (var alloc in injectionArray) {

            //     if(injectionArray[alloc].portfolio == "" || injectionArray[alloc].portfolio == null || Number(injectionArray[alloc].shares) == 0){
            //         continue;
            //     }
            //     else 
            //     {   
            //         if(Math.abs(injectionArray[alloc].shares) > 9999)
            //         {
            //             accumulator= accumulator + Number(injectionArray[alloc].shares)%1000
            //             remainer = Number(injectionArray[alloc].shares)%1000
            //         }
            //         else if(Math.abs(injectionArray[alloc].shares) > 999){
            //             accumulator = accumulator + Number(injectionArray[alloc].shares)%100
            //             remainer = Number(injectionArray[alloc].shares)%100
            //         }
            //         else if(Math.abs(injectionArray[alloc].shares) > 99){
            //             accumulator = accumulator + Number(injectionArray[alloc].shares)%10
            //             remainer = Number(injectionArray[alloc].shares)%10
            //         }
            //         else if(Math.abs(injectionArray[alloc].shares) > 9){
            //             accumulator = accumulator + Number(injectionArray[alloc].shares)%1
            //             remainer = Number(injectionArray[alloc].shares)%1
            //         }


            //         injectionArray[alloc].shares = injectionArray[alloc].shares - remainer;
            //         if(alloc == Object.keys(injectionArray).length - 1) {
            //             injectionArray[alloc].shares = injectionArray[alloc].shares + Math.round(accumulator)
            //             console.log(accumulator)
            //         }
            //     }
            // }

            let counter = 0;
            for(var y in allocations)
            {
               let original = allocations[y].shares;
               let reconciler = 0;
                for(var z in injectionArray)
                {
                    if(allocations[y].broker == injectionArray[z].broker)
                    {
                        reconciler += injectionArray[z].shares
                        counter += 1;
                    }
                }


                if(reconciler != original)
                {
                    //console.log(original,reconciler)
                    let diff = original - reconciler
                    injectionArray[counter - 1].shares +=diff
                }
            }
            console.log(injectionArray, " reconciled ")
            
            let checker = 0;


    
            for (var alloc in injectionArray) {
                if(injectionArray[alloc].portfolio == "" || injectionArray[alloc].portfolio == null || Number(injectionArray[alloc].shares) == 0){
                    continue;
                }
                else 
                {  
                    checker = checker + injectionArray[alloc].shares
                }
            }
            console.log(checker)
    
            let diff = Math.abs(totalShares) - Math.abs(checker)
            console.log(totalShares)
            injectionArray[Number(Object.keys(injectionArray).length -1)].shares += Math.round(diff); 
          

            for (var items in injectionArray)
            {

                const url = `http://${ipAddress}:${Port}/trades/add?Issuer=${injectionArray[items].issuer}&Trade_Date=${this.state.tradeDate}&Ticker=${this.state.selectedTicker}&Portfolio=${injectionArray[items].portfolio}&Shares=${injectionArray[items].shares}&Action=${this.state.selectedAction}&Price=${injectionArray[items].price}&Commission=${injectionArray[items].commission}&Broker=${injectionArray[items].broker}&Trader=${this.state.username}&splitID=${injectionArray[items].splitID}`;
                console.log(url)
                fetch(url, {
                  method: "GET"
                })
            }

            for(var items in posts)
            {
                if(Number(posts[items].id) < 0) {continue}
                const url = `http://${ipAddress}:${Port}/trades/delete?id=${posts[items].id}`
                console.log(url);
                fetch(url,{
                method: "GET"
                })
            }
            this.props.closing();
        })
            //return post2;
        
      
        //console.log(splitID, " this shit printed or nah")
        //console.log("Split id supposed to come first")
        //console.log("Supposed to be joined array " + portfolioString)

    }

    handleAddSplitData=() => {
        let states = this.state.splitData
        console.log(states)
        states.push(
            {   
                broker: "",
                shares: "",
                price: "",
                commission: "",
                add: "",
                delete: ""
            }                                   
        )
        //console.log(states)
        this.setState({splitData:states})
    }

    handleDeleteSplitDataRow = (cellInfo) => {
        let states = this.state.splitData
        if(cellInfo.viewIndex !=0){
            states.splice(cellInfo.viewIndex, 1);
            this.setState({splitData:states}) 
        }
        else if(cellInfo.viewIndex == 0 && Object.keys(this.state.splitData).length >1)
        {
            states.shift();
        }
        else if(cellInfo.viewIndex == 0 && Object.keys(this.state.splitData).length == 1)
        {
            this.setState(
                {
                    splitData: [
                        {
                            broker: "",
                            shares: "",
                            price: "",
                            commission: "",
                            add: "",
                            delete: ""
                        }
                    ],
                }
            )
        }
    }

    handleSplitTableReset = () => {
        this.setState({splitData:JSON.parse(JSON.stringify(this.state.initialSplitData))},
        )
    }


//#endregion


//#region SPLIT SHARE EDITABLE FIELD RENDERERS 


        renderSplitSharesEditable(cellInfo) {
            //let inputRef = null;
            return(
                <div 
                    //style={{Color}}

                    contentEditable
                    suppressContentEditableWarning


                    //ref={(input) => {inputRef= input} }
                    onKeyPress = {
                        e => {
                            // if(e.keycode == '37' ||e.keycode == '38' ||e.keycode == '39' ||e.keycode == '40')
                            // {
                            //    console.log(e) 
                            // }
                            
                            this.firstMethod(e);
                        }
                    }

                    // onKeyDown = {
                    //     e => {
                    //         if(e.keyCode == 40)
                    //         {
                    //             console.log(cellInfo)
                                
                    //             console.log(inputRef)//.focus()
                    //         }
                            
                    //        // console.log(this.editShares.nextElementSibling.focus();
                    //     }
                    // }

                    onBlur = {e=>{
            
                    let splitData = [...this.state.splitData];
                    console.log(e.target.innerHTML)
                    if(String(this.state.selectedAction).includes("SELL")) {
                        splitData[cellInfo.index][cellInfo.column.id] = Math.abs(Number(e.target.innerHTML))* -1;
                    }
                    else{ 
                        splitData[cellInfo.index][cellInfo.column.id] = Number(e.target.innerHTML)
                    }
                    
                    //this.handleAllocationShareValueChanged()
                    this.setState({splitData});
                    console.log(this.state.splitData)
                    //console.log(data)
                    //this.setState({data})
                    }}

                    dangerouslySetInnerHTML ={{
                        __html:this.state.splitData[cellInfo.index][cellInfo.column.id]
                    }}
                />
            )
        }


        renderSplitPriceEditable(cellInfo) {

            return(
                <div 
                    //style={{Color}}
                    contentEditable
                    suppressContentEditableWarning

                    onKeyPress = {
                        e => {
                        this.firstMethod(e);
                        }
                    }

                    onBlur = {e=>{
            
                    let splitData = [...this.state.splitData];
                    splitData[cellInfo.index][cellInfo.column.id] = Math.abs(Number(e.target.innerHTML))
                    this.setState({splitData})
                    }}

                    dangerouslySetInnerHTML ={{
                        __html:this.state.splitData[cellInfo.index][cellInfo.column.id]
                    }}
                />
            )
        }

        renderSplitCommissionEditable(cellInfo) {

            return(
                <div 
                    //style={{Color}}
                    contentEditable
                    suppressContentEditableWarning

                    onKeyPress = {
                        e => {
                        this.firstMethod(e);
                        }
                    }

                    onBlur = {e=>{
            
                        let splitData = [...this.state.splitData];
                        splitData[cellInfo.index][cellInfo.column.id] = Math.abs(Number(e.target.innerHTML))
                        this.setState({splitData})
                    }}

                    dangerouslySetInnerHTML ={{
                        __html:this.state.splitData[cellInfo.index][cellInfo.column.id]
                    }}
                />
            )
        }

//#endregion

    firstMethod(e) {
        const re = /^\d*\.?\d*$/g;
        if(!re.test(e.key)) {
          e.preventDefault();
          return
        }
    }

    render (){

        const {
            tickers
        } = this.state;
//#region COLUMNS Allocate Accounts
        const columns =[{
            width: 400,
            columns: [
                {
                    Header: <div ><strong>Portfolio</strong></div>,
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
                            options={this.props.portfolios}
                            onChange={(props) => this.handlePortfolioSelected(row, props)}
                        />
                    )
                
                },
                {
                    Header: <strong>Old Shares</strong>,
                    accessor: 'oldShares',
                    width: 150,
                },
                {
                    Header: <strong>Shares</strong>,
                    accessor: 'shares',
                    width: 150,
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
                    Header:<div width="10px"><IconButton style={{width:"10px", height:"10px", paddingTop:"0px", paddingBottom:"20px"}} onClick={this.handleTableReset}><ReplayIcon fontSize="small"/></IconButton></div>,
                    accessor: "delete",
                    width: 45,
                    getProps: () => {
                        return{
                          style:
                            {
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

//#region COLUMNS Split Trades
        const columnsSplitTrades =[{
            width: 400,
            columns: [
                {
                    Header: <div><strong>Brokers</strong></div>,
                    accessor: "portfolio",
                    width: 170,
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
                        // <Select
                        // //name={row.value}
                        //     onChange={this.handleBrokerChange}
                        //     defaultInputValue={this.state.selectedBroker}
                        //     style={{
                        //         width:"80%",
                        //         display:"flex"
                        //     }}
                        //     autoSize
                        //     name="Brokers"
                        //     options={this.props.brokers}
                        //     placeholder="Select Broker.."
                        // />

                        <Select
                        placeholder="Select Broker.."
                        defaultInputValue={row.original.broker}
                        options={this.props.brokers}
                        onChange={(props) => this.handleBrokerSelected(row, props)}
                        />
                    )
                
                },
                {
                    Header: <strong>Shares</strong>,
                    accessor: 'shares',
                    width: 130,                    
                    getProps:(cellInfo) => {
                        return{
                        style:{
                            padding: "9px",
                            fontSize: "20"
                            }
                        }
                    },
                    Cell:this.renderSplitSharesEditable
                },
                {
                    Header: <strong>Price</strong>,
                    accessor: 'price',
                    width: 100,                    
                    getProps:(cellInfo) => {
                        return{
                        style:{
                            padding: "9px",
                            fontSize: "20"
                            }
                        }
                    },
                    Cell:this.renderSplitPriceEditable
                },
                {
                    Header: <strong>Commission</strong>,
                    accessor: 'commission',
                    width: 130,                    
                    getProps:(cellInfo) => {
                        return{
                        style:{
                            padding: "9px",
                            fontSize: "20"
                            }
                        }
                    },
                   Cell:this.renderSplitCommissionEditable
                },
                {
                    Header:"",
                    accessor: "add",
                    width: 40,
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
                            <IconButton onClick={this.handleAddSplitData}><AddIcon fontSize="small"/></IconButton>
                        )
                    }
                },
                {
                    Header:<div width="10px"><IconButton style={{width:"10px", height:"10px", paddingTop:"0px", paddingBottom:"20px"}} onClick={this.handleSplitTableReset}><ReplayIcon fontSize="small"/></IconButton></div>,
                    accessor: "delete",
                    width: 40,
                    getProps: () => {
                        return{
                        style:
                            {
                                //overflow:"Visible",
                                color:"black",
                                //fontSize:"12px",
                                padding:"0px"
                            }
                        }
                    },
                    Cell: (cellInfo) => {
                        
                        return(
                            <IconButton onClick={() => this.handleDeleteSplitDataRow(cellInfo)}><DeleteIcon fontSize="small"/></IconButton>
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
                    <Button variant="contained" size="small" color="primary" onClick={this.handleClickOpen}><EditIcon fontSize="small"/></Button>
                    <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    maxWidth="lg"
                    fullWidth={false}
                    display='flex'
                    width ='fit-content'
                    >
                    
                    <DialogTitle id="form-dialog-title"> Edit Trade </DialogTitle>
                    <DialogContent style={{flex:"100 0 auto"}} >
                        {/* <div className="container">
                        &nbsp; Select Ticker
                        </div>
                         */}

                         <div>
                                &nbsp;
                                &nbsp;
                                <DatePicker 
                                    initialDate = {this.state.tradeDate}
                                    label="Trade Date "
                                    changed={this.handleDateChange1}
                                />
                                &nbsp;
                                &nbsp;
                                <DatePicker
                                    initialDate= {addDays(new Date(this.state.tradeDate), 2)}
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
                            <Input style={{width:"100px"}} onKeyPress = {e => {this.firstMethod(e);}} defaultValue={this.state.price} onBlur={this.handlePriceChange} startAdornment={<InputAdornment postion="start">$ </InputAdornment>}></Input>

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
                            <Input style={{width:"100px"}} onKeyPress = {e => {this.firstMethod(e);}} defaultValue={this.state.commission} onBlur={this.handleCommissionChange} startAdornment={<InputAdornment postion="start">$ </InputAdornment>}></Input>
                        </div>
                        <br/>

                        {this.state.splitActive == true?
                            <div className="container">
                                <strong>Allocate Portfolios</strong>
                                <div style={{ paddingBottom:"0px", paddingLeft:"485px"}}>
                                <strong>Split Trades</strong>
                                &nbsp;
                                <IconButton onClick={this.handleOpenSplit}><CallSplit fontSize="small"/></IconButton> 
                                </div>
                            </div> 
                        :
                            <div className="container">
                                <strong>Allocate Portfolios</strong>
                                <div style={{ paddingBottom:"0px", paddingLeft:"325px"}}>
                                <strong>Split Trades</strong>
                                &nbsp;
                                <IconButton onClick={this.handleOpenSplit}><CallSplit fontSize="small"/></IconButton> 
                                </div>
                            </div> 
                        }

                        <div className="container">
                            <ReactTable2
                                data={this.state.data}
                                columns={columns}
                                //className = "-striped -highlight"
                                showPagination = {false}
                                pageSize={25}
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
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &#160;
                            {this.state.splitActive == true?
                                <ReactTable2
                                    data={this.state.splitData}
                                    columns={columnsSplitTrades}
                                    //className = "-striped -highlight"
                                    showPagination = {false}
                                    //pageSize={Number(Object.keys(this.state.data)) + 1}
                                    //noDataText={null}
                                    NoDataComponent = {NullComponent}
                                    getTableProps={() => {
                                        //console.log(column)
                                    return {
                                        style:{
                                            //color: "white",
                                                textAlign:"center",
                                                overflow:"Visible",
                                                height: "300px"
                                            }
                                        }
                                    }}
                                >
                            </ReactTable2> : null }
                        </div>
                        <div>
                        </div>
                    </DialogContent>                
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                    </Dialog>
                </div>
            </Fragment>
        );
    }
}