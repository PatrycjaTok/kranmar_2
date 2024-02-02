import React from 'react';
// Opensource Libraries
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Cookies from "universal-cookie";
import { Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
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

class HomePage extends React.Component{
  
  constructor(props){
    super(props);
  }

  whoami = () =>{

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
        console.log('You are logged in as ' + data.username);
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  }

  handleNavigateClick = (event) =>{
    event.preventDefault();
    
  }

  render(){
    return(
      <div className='h-100vh homePage'>
          <NavBarTop handleLogout={this.props.handleLogout}/>
         {/* <h1>You are logged in! Hi!</h1>
          <button className="btn btn-primary" onClick={this.whoami}>Kim jesten</button>    
          <button className="btn btn-primary" onClick={this.Logout}>Wyloguj się</button>     */}
          <div className='container-xxl d-flex px-0'>
            <div className='content-container'>
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