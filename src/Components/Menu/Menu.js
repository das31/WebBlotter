import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const options = [
    'Settings',
    'Logout'
]

const ITEM_HEIGHT = 48;


class LongMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({anchorEl:event.currentTarget});
    };
    handleClose = () => {
        this.setState({anchorEl:null})
    };

    handleLogout = (e, x) => {
        console.log(e)
        if(e =="Logout"){
            this.props.onLogout(); 
        }
        this.setState({anchorEl:null})
    }



    render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl)


        return (
            <div>
                <IconButton 
                 aria-label ="More"
                 aria-owns={open? 'long-menu' : undefined}
                 aria-haspopup="true"
                 onClick={this.handleClick}
                 style={{
                      margin:3,
                    }}
                >
                 <MoreVertIcon />

                </IconButton>

                <Menu 
                 id="long-menu"
                 anchorEl={anchorEl}
                 open={open}
                 onClose={this.handleClose}
                 PaperProps ={{
                     style: {
                         maxHeight: ITEM_HEIGHT * 4.5,
                         width:200
                     }
                 }}
                
                >
                {options.map(option => (
                    <MenuItem key={option} onClick={event => this.handleLogout(option, event)}>
                        {option}
                    </MenuItem>
                ))}

                </Menu>
            </div>
        )
    }
}
export default LongMenu;
