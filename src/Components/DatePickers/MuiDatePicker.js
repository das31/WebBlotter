import React from 'react';
import {MuiPickersUtilsProvider, DatePicker} from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';


export default class MuiDatePicker extends React.Component {
    state = {
        selectedDate: this.props.initialDate
    }


    componentDidMount() {
        this.setState({selectedDate: this.props.initialDate})

    }

    handleDateChange = date => {
        this.setState({selectedDate: date});
        this.props.changed(date);
        console.log(this.props.initialDate)
    };

    render() {
        const { selectedDate } = this.state;
        return(
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    margin="dense"
                    value={selectedDate}
                    //defaultValue={this.props.defValue}
                    
                    onChange={this.handleDateChange}
                    style={
                        {
                            width:180
                        }
                    }
                    label = {this.props.label}
                />
            </MuiPickersUtilsProvider>
        )
    }
}
