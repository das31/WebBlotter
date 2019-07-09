import React from "react";
import _ from "lodash";
import {isEqual} from "lodash";
import classNames from "classnames";
import matchSorter from "match-sorter";



export default [
    {
      Header: "",
      width: 35,
      filterable: false,
      resizable: false,
      sortable: false,
      Aggregated: cellInfo => {
          const needsExpander =
            cellInfo.subRows && cellInfo.subRows.length > 1 ? true:false;
          const expanderEnabled = !cellInfo.column.disableExpander;
          return needsExpander && expanderEnabled ? (
              <div className={classNames("rt-expander", cellInfo.isExpanded && "-open")}>
                  &bull;
              </div>
          ) :null;
        
      },
      Cell: null,
      Expander:({isExpanded, ...rest}) =>
      <div>
        {isExpanded
        ? <span>&#x2299;</span> : <span>&#x2295;</span>}
      </div>
    },
    {pivot: true},
    {
      Header: 'Id',
      accessor: "Id",
      show: false       
    },
    {
      Header: 'Ticker',
      accessor: 'Ticker',
      Pivot: row => {
          return row.value;
      },
      width:"50px"
    },
    {
      getProps:(state,rowInfo) =>{
        if(rowInfo && rowInfo.row){
          return{
            style:{
              background:
                rowInfo.row.Status === "Pending" ? "grey" : "null" ||
                rowInfo.row.Status ==="Complete"? "lightgreen" : "null"
                || rowInfo.row.Status ==="In Process" ? "yellow" : "null"
            }
          };
        } else{
          return {};
        }
      },
      Header: 'Status',
      accessor: 'Status',
      //aggregate: (values) => this.returnPendingOrComplete(values)
    },
    {
      getProps:(state,rowInfo) =>{
        if(rowInfo && rowInfo.row){
          return{
            style:{
              background:
                rowInfo.row.Shares < 0 ? "salmon" : "lightblue"
            }
          };
        } else{
          return {};
        }
      },
      Header: 'Shares',
      accessor: 'Shares',
      aggregate: (values, rows) => _.sum(values),
    },
    {
      Header: 'Action',
      accessor: 'Action',
      aggregate: (values, rows) => _.uniqWith(values,isEqual).join(", ")
    },
    {
      Header: 'Portfolio',
      accessor: 'Portfolio',
      width: 10000
    },
    {
      Header: 'Price',
      accessor: 'Price',
      aggregate: (values, rows) =>_.round(_.mean(values)),
    },
    {
      Header: 'Broker',
      accessor: 'Broker',
      aggregate: (values, rows) => _.uniqWith(values, isEqual).join(", "),
      //show:true
    },
    {

     Header: 'Trader',
     accessor: 'Trader',
     aggregate: (values, rows) => _.uniqWith(values, isEqual).join(", "),
     filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, {keys: ["Trader"]}),
     filterAll:true
    }
];