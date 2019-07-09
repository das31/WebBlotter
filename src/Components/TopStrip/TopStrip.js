import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import DatePicker from "../DatePickers/DatePickerMui";
import AddTrades from "../Forms/AddTrades/AddTrades.redux";
import Copy from "../Buttons/Copy"
import Login from "../Forms/Login"
import LongMenu from "../Menu/Menu"
import Button from '@material-ui/core/Button'
import {fetchTrades} from '../../actions/fetchItems.action';



const useStyles = makeStyles(theme => ({
  appBar: {
   background: 'linear-gradient(to right, #03001e, #2f80ed, #03001e)'
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    paddingLeft: 350
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function TopStrip() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }
  function handleNewDate(date,label) {
    console.log(date, label, "new Date")
    //console.log(this.props,"props from redux")
  }
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="Show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="Show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="Account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar  position="static" color='primary' className={classes.appBar}>
        <Toolbar>
            <div style={{paddingRight:20}}>
               <DatePicker
               label ="From"
               newDate= {(date,label)=>handleNewDate(date,label)}
                />
            </div>
            <div>
                <DatePicker
                label = "To"
                newDate = {(date,label)=>handleNewDate(date,label)}
                /> 
            </div>

          <Typography className={classes.title} variant="h6" noWrap>
            Web-Blotter.io
          </Typography>
            
            {/* <AddTrades
                tickers = {this.props.tickers}
            /> */}
          
            {/*           
            <div style={
                {
                    paddingRight:'8px',
                    paddingLeft: '50px',
                    
                }
                }>
                <DatePicker         
                label="From: "
                //changed={this.handleDateChange1}
            />
            </div>

            <DatePicker
            label="To: "
            //changed={this.handleDateChange2}
            />  */}

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="Show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="Show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="Account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="Show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}




























// import React from "react";
// import DatePicker from "../DatePickers/MuiDatePicker";
// import AddTrades from "../Forms/AddTrades/AddTrades";
// import Copy from "../Buttons/Copy"
// import Login from "../Forms/Login"
// import LongMenu from "../Menu/Menu"
// import Button from '@material-ui/core/Button'
// import AppBar from '@material-ui/core/AppBar'
// import { createMuiTheme, makeStyles } from '@material-ui/core/styles'
// import { ThemeProvider} from '@material-ui/styles'
// import { purple } from "@material-ui/core/colors";







// export default class TopStrip extends React.Component{
    
//     constructor(props)
//     {
//         super(props)
//         this.state = {
            
//         }
//     }


    
//     render()
//     {


            
//     var theme = createMuiTheme(
//         {
//             palette:{
//                 primary:{main:purple[500]},
//                 secondary: {main :'#11cb5f'}
                
//             }
//         }
//     )
        
//         return (
//             <ThemeProvider  theme={theme}>
//                 <AppBar color="primary">

//                 <div className='container'>
//                     <DatePicker 
                    
//                     label="From: "
//                     changed={this.handleDateChange1}
//                     />

//                     <DatePicker
//                     label="To: "
//                     changed={this.handleDateChange2}
//                     /> 

//                     {/*<Button 
//                     variant="contained" 
//                     style={{margin:10}}
//                     onClick={this.handleLoginClick}
                    
//                     > Login </Button>
//                     {this.state.showLogin == true?
                    
//                     <Login 
//                     onClose={this.handleLoginClick}
                    
//                     >
                    
//                     </Login>:<LongMenu onLogout={this.handleLogoutClick}/>}

//                     {this.state.user == null || ""? null :<div style={{margin:15}}> Welcome {" " + this.state.user}</div>}
                    
//                     <AddTrades
//                     opening={() => {this.state.childFormOpen=true; console.log(this.state.childFormOpen)}}
//                     closing={() => { this.state.childFormOpen=false;this.refreshData(); console.log(this.state.childFormOpen)}} 
//                     tickers={this.state.tickers}
//                     brokers={this.state.broker}/>

//                     <Copy data={this.state.data}/> */}
//                 </div>

//                 </AppBar>


//             </ThemeProvider>


//         )
//     }
   
// }