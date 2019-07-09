import 'date-fns'
import React from 'react';
import {makeStyles} from '@material-ui/core/styles'
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeybardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers'



const useStyles = makeStyles( themes => ({
    cssLabel: {
        color: 'white',
        border: 'white',
        foreground: 'white'
    }
}))

export default function MaterialUIDatePicker(props) {
    const [selectedDate, setSelectedDate] = React.useState(new Date())
    
    function handleDateChange(date){
        setSelectedDate(date);
        props.newDate(date,props.label);
    }
    const classes = useStyles()

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <KeyboardDatePicker
                margin="normal"
                id="mui-pickers-date"
                label ={props.label}
                value = {selectedDate}
                onChange = {handleDateChange}
                style = {{
                    width: 150,
                    
                }}
                
                InputLabelProps ={{
                    className: classes.cssLabel
                }}
                InputProps ={{
                    className: classes.cssLabel
                }}
                InputAdornmentProps = {{
                    className: classes.cssLabel
                }}
                color='secondary'
                KeyboardButtonProps ={{
                    'aria-label' : 'change date'
                }}
            
            />

        </MuiPickersUtilsProvider>
    )


}