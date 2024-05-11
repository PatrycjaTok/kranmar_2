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
import Employee from './employee_data.js';

const cookies = new Cookies();
library.add(faUser);

class HomePage extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      username : '',
      date: '',
      account_settings: {}
    }
    this.handleAccSettingsRangeInputClick = this.handleAccSettingsRangeInputClick.bind(this);
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

  accountSettings = () =>{
    const self = this; 

    $.ajax({
      url: baseURL + '/account-settings/',
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
        self.setState({account_settings: data.account_settings[0]})
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  }

  handleAccSettingsRangeInputClick(ev){
    const self = this; 
    let evTarget = $(ev.target);
    let inputName = evTarget.attr('name');
    let inputValue = Number(evTarget.val()) === 1 ? true : false;
    let requestData = {
      'name': inputName,
      'value': inputValue
    };

    $.ajax({
      url: baseURL + '/account-settings-auto-save/',
      method: 'POST',
      dataType: 'json',
      xhrFields: {
          withCredentials: true
      },
      headers: {
        "Content-Type": 'application/json',
        "X-CSRFToken": cookies.get("csrftoken")
      },
      data: JSON.stringify(requestData),
      // cache: false,
      success: function(data) {
        self.accountSettings();
      },
      error: function(xhr, status, err) {
        console.log(err);
      }
    });


  }

  handleNavigateClick = (event) =>{
    event.preventDefault();
    
  }

  createDateDisplay = () => {
    const todayDate = new Date();
    let day = todayDate.getDate();
    let month = todayDate.getMonth();
    let year = todayDate.getFullYear();

    if(day<10){day = "0" + day;}
    if(month<10){month = "0" + (month+1);}
    if(year<10){year = "0" + year;}

    let todayDateDisplay = `${day}-${month}-${year}`;
    return todayDateDisplay;
  }

  handleDateCheck = () => {
    let newDateDisplay = this.createDateDisplay();
    if(newDateDisplay !== this.state.date){
      this.setState({date: newDateDisplay});
    }
  }

  componentDidMount(){
    this.whoami();
    this.accountSettings();
    let todayDateDisplay = this.createDateDisplay();
    this.setState({date: todayDateDisplay});
  }

  render(){

    return(
      <div className='homePage'>
          <NavBarTop handleLogout={this.props.handleLogout} handleDateCheck={this.handleDateCheck}/>
          <div className='text-primary noHover username-container'><span id='currentDateDisplay' className='px-2 text-dark'>{this.state.date}</span><FontAwesomeIcon icon={faUser} /><span className='px-1'>{this.state.username}</span></div>
          <div className='container-xxl d-flex px-0 justify-content-center'>
            <div className='content-container px-1 p-md-3'>
              <Routes>
                <Route  element={<Dashboard account_settings={this.state.account_settings} />} path="/" />
                <Route element={<Employees account_settings={this.state.account_settings} />} path="/employees" />
                <Route element={<Companies account_settings={this.state.account_settings} />} path="/companies" />
                <Route element={<Holidays account_settings={this.state.account_settings} />} path="/holidays" />
                <Route element={<HistoryChanges account_settings={this.state.account_settings} />} path="/history-changes" />
                <Route element={<HistoryHolidays account_settings={this.state.account_settings} />} path="/history-holidays" />
                <Route element={<Settings account_settings={this.state.account_settings} handleAccSettingsRangeInputClick={this.handleAccSettingsRangeInputClick} />} path="/settings" />
                <Route element={<Employee account_settings={this.state.account_settings} />} path="/employee-data" />
                <Route path="*" element={<Navigate to ="/" />}/>
              </Routes>                            
            </div>        
          </div>          
      </div>
    )
  }

}

export default HomePage;