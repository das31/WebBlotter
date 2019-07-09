export const columns =[
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
            
          },
          {
            headerName:"Trade Date",
            field: "Trade_Date",
            sortable:true,
            filter:true,
            
          },
          {
            headerName:"Status",
            field: 'Status',
            sortable:true,
            filter:true,
            cellStyle: function(params){
              if(params.value === 'Complete'){
                return {backgroundColor:'lightgreen'}
              }
              else if(params.value ==='In Process')
              {
                return {backgroundColor:'yellow'}
              }
              else {
                return {color:'white',backgroundColor:'grey'}
              }
            }
            
          },
          {
            headerName: 'Shares',
            field: 'Shares',
            sortable:true,
            filter:true,
          },
          {
            headerName: 'Action',
            field: 'Action',
            sortable:true,
            filter:true,
            cellStyle: function(params){
              if(String(params.value).includes('SELL')){
                return {backgroundColor:'pink'}
              }
              else if(String(params.value).includes("BUY")   )
              {
                return {backgroundColor:'lightblue'}
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
          },
          {
            headerName: 'Price',
            field: 'Price',
            sortable:true,
            filter:true,
            editable: true,
            cellStyle: function(params){
              return {color:'green'}
            }
          },
          {
             headerName: "Commission",
             field: "Commission",
             sortable:true,
             filter:true,
             editable: true,
             cellStyle: function(params){
              return {color:'green'}
            }
          },
          {
            headerName: 'Broker',
            field: 'Broker',
            sortable:true,
            filter:true,
            cellEditorSelector: function(params) {
              return { 
                component: 'agRichSelectCellEditor',
                params: {values: ["item1","item2"]}
              }
            }
          },
          {
           headerName: 'Trader',
           field: 'Trader',
           sortable:true,
           filter:true,
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

export const defaultColumnDefs = 
  {
    sortable:true,
    resizable: true,
   // width:120,
    filter: "agTextColumnFilter"
  }
