import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';




export default class FormDialog extends React.Component{

    state = 
    {
        data: [],
        CSVData: []
    };

    constructor(props)
    {
        super(props)

        this.state = {
            data:this.props.data
        }
    }



    handleCopy = () => {
        const replacer = (key, value) => value == null? '' :value
        const header = Object.keys(this.props.data[0])

        let csv = this.props.data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join('\t'));
        csv.unshift(header.join('\t'));
        csv = csv.join('\r\n');
        //navigator.clipboard.writeText(csv);
        this.copyToClipboard(csv);
        console.log(csv)
    }

    copyToClipboard = (csv) => {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = csv;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    render() {
        return (
            <Button 
            variant="outlined" 
            color="primary" 
            onClick={this.handleCopy} 
            style={{margin:10}}
            >
               Copy (No Use)
            </Button>
        )
    }

}