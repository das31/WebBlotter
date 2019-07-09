import React from 'react';
import Button from '@material-ui/core/Button'
import Textfield from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


export default class FormDialog extends React.Component{
    state = {
        open: false,
        username:"",
    };

    handleClickOpen =() => {
        this.setState({open:true})
    }

    handleClose = () => {
        this.setState({open:false})
        
    };

    handleLogin = () => {
        this.setState({open:false})
        this.props.onClose(this.state.username);

        //console.log(this.state.username)
    }

    handleChange = (e) => {

        const re = /^[a-zA-Z]*$/g;
        if(!re.test(e.target.value)){
          e.preventDefault();
        }else{

            this.setState({username: e.target.value})
            //console.log(e.target.value)
        }
    }


    render(){
        return(
            <div>
                <Button 
                 variant="outlined" 
                 color="primary" 
                 onClick={this.handleClickOpen} 
                 style={{margin:10}}
                 >
                    Login
                </Button>
                <Dialog
                 open={this.state.open}
                 onClose={this.handleClose}
                 aria-labelledby="form-dialog-title"
                >
                
                <DialogTitle id="form-dialog-title"> Login </DialogTitle>
                
                <DialogContent>
                    <Textfield 
                        autoFocus
                        margin="dense"
                        id="name"
                        label="User Name"
                        type="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        
                        //autoComplete
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleLogin} color="primary">
                        Login
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        );
    }
}