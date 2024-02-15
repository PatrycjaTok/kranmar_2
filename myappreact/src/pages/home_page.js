import React from 'react';
// Opensource Libraries
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Cookies from "universal-cookie";
import { Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser} from "@fortawesome/free-solid-svg-icons";
// Custom server urls
import baseURL from '../utils/request';
// Custom files and Components
import '../main.css';
import '../utils/base_functions_home.js';
import NavBarTop from './navbar.js';
import Dashboard from './dashboard.js';
import Employees from './employees.js';
import Holidays from './holidays.js';
import HistoryChanges from './history_changes.js';
import HistoryHolidays from './history_holidays.js';
import Settings from './settings.js';
import Companies from './comapnies.js';

const cookies = new Cookies();
library.add(faUser);

class HomePage extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      username : '',
    }
  }

  whoami = () =>{
    const self = this; 

    $.ajax({
      url: baseURL + '/whoami/',
      method: 'GET',
      dataType: 'json',
      xhrFields: {
          withCredentials: true
      },
      headers: {
        "Content-Type": 'application/json',
        "X-CSRFToken": cookies.get("csrftoken")
      },
      // cache: false,
      success: function(data) {
        self.setState({username: data.username})
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  }

  handleNavigateClick = (event) =>{
    event.preventDefault();
    
  }

  componentDidMount(){
    this.whoami();
  }

  render(){

    return(
      <div className='homePage'>
          <NavBarTop handleLogout={this.props.handleLogout}/>
          <div className='text-primary noHover username-container'><FontAwesomeIcon icon={faUser} /><span className='px-1'>{this.state.username}</span></div>
          <div className='container-xxl d-flex px-0 justify-content-center'>
            <div className='content-container px-1 p-md-3'>
              <Routes>
                {/* <Route  element={<Dashboard loginMethod={this.props.loginMethod} usernameValue={this.props.usernameValue} usernameOnChange={this.props.usernameOnChange} passwordValue={this.props.passwordValue} passwordOnChange={this.props.passwordOnChange} errors={this.props.errors} clearErrorsMethod={this.props.clearErrorsMethod} />} path="/" /> */}
                <Route  element={<Dashboard />} path="/" />
                <Route element={<Employees />} path="/employees" />
                <Route element={<Companies />} path="/companies" />
                <Route element={<Holidays />} path="/holidays" />
                <Route element={<HistoryChanges />} path="/history-changes" />
                <Route element={<HistoryHolidays />} path="/history-holidays" />
                <Route element={<Settings />} path="/settings" />
                <Route path="*" element={<Navigate to ="/" />}/>
              </Routes>                            
            </div>        
          </div>          
      </div>
    )
  }

}

export default HomePage;