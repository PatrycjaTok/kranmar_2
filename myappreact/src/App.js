import * as React from "react";
// import * as ReactDOM from "react-dom/client";
// import { BrowserRouter as BrowserRouter, Route, Routes, redirectDocument } from 'react-router-dom';
// Opensource Libraries
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from "universal-cookie";
// Custom server urls
import baseURL from './utils/request';
import baseURLFront from './utils/base_url_front.js'
// Custom files and Components
import './main.css';
import CustomPagesLoginPage from './pages/base_page.js';
import baseFunctions from './utils/base_functions.js';
import HomePage from './pages/home_page.js';

const cookies = new Cookies();

class App extends React.Component {

  constructor(props){
    super(props);
    this.state={
      username: '',
      password: '',
      error: '',
      isAuthenticated: false,
      success: '',
    }
  }

  componentDidMount = () => {
    this.getSession();
  }

  getSession = () =>{
   
    $.ajax({
      url: baseURL + '/session/',
      dataType: 'json',
      xhrFields: {
          withCredentials: true
      },
      // cache: false,
      success: function(data) {
        if (data.isAuthenticated){
            this.setState({isAuthenticated: true});
          }else{
            this.setState({isAuthenticated: false});
          }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });

  }

  clearErrors = () =>{
    this.setState({error: ''});
    this.setState({success: ''});

  }

  handlePasswordChange = (event) =>{    
    this.setState({password: event.target.value});
  }

  handleUserNameChange = (event) =>{    
    this.setState({username: event.target.value});
  }

  isResponseOk(response){
    if(response.status >= 200 && response.status <= 299){
      return response.data;
    }else{
      throw Error(response.statusText);
    };
  }

  Login = (event) =>{
    event.preventDefault();

    if(!this.state.username || !this.state.password){
      this.setState({error: 'Uzupełnij dane.'})
      return;
    }else{
      this.setState({error: ''})
    }

    let data = JSON.stringify({
      username: this.state.username,
      password: this.state.password
    });

    $.ajax({
      url: baseURL + '/login/',
      method: 'POST',
      dataType: 'json',
      headers: {
        "Content-Type": 'application/json',
        "X-CSRFToken": cookies.get("csrftoken")
      },
      data: data,
      xhrFields: {
          withCredentials: true
      },
      // cache: false,
      success: function(data) {
        if(this.isResponseOk){
          this.setState({isAuthenticated: true, username: "", password: "", error: ""});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        let errorText = xhr.responseJSON.messages.errors;
        this.setState({error: errorText})
      }.bind(this)
    });
  }

  Logout = () =>{

    $.ajax({
      url: baseURL + '/logout/',
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
        this.setState({isAuthenticated: false})
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });
  }

  handleRegistryFormSubmit = (event) =>{
    event.preventDefault();

    let validation = baseFunctions.formValidation($(event.target))

    if(validation.validation){
      const data = new FormData(event.target);
      const objectData = JSON.stringify(Object.fromEntries(data.entries()));

      $.ajax({
        url: baseURL + '/registry/',
        method: 'POST',
        dataType: 'json',
        headers: {
          "Content-Type": 'application/json',
          "X-CSRFToken": cookies.get("csrftoken")
        },
        data: objectData,
        xhrFields: {
            withCredentials: true
        },
        // cache: false,
        success: function(data) {
          if(this.isResponseOk){           
            this.setState({
              success: 'Konto zostało utworzone!',
              error: '',
            });
            setTimeout(() => {
              window.location.replace(baseURLFront + '/');
            }, 5000);            
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.log('ERROR')
          let errorText = xhr.responseJSON.messages.errors;
          this.setState({error: errorText})
        }.bind(this)
      });

    }else{
      let errorText = '';
      for(let i=0; i< validation.errors.length; i++){
        errorText += validation.errors[i];
        if(i < validation.errors.length -1){errorText += '\n'}
      }
     
      this.setState({error: errorText})
    }
  }

  render(){
    if(!this.state.isAuthenticated){
      const csrfCookie = cookies.get("csrftoken");
      return(
        <div>
          <CustomPagesLoginPage.LoginPanelFrame loginMethod={this.Login} passwordValue={this.state.password} passwordOnChange={this.handlePasswordChange} usernameValue={this.state.username} usernameOnChange={this.handleUserNameChange} errors={this.state.error} successes={this.state.success} cookies={csrfCookie} handleRegistryFormSubmit={this.handleRegistryFormSubmit} clearErrorsMethod = {this.clearErrors} />
        </div>
      )
    }
    // TODO: if requestAnimationFrame.user.is_authenticated
    return (
      <div>
          <HomePage handleLogout = {this.Logout} />
      </div>
    )
  }

}

export default App;

/* <a href="https://www.freepik.com/free-photo/construction-site-building_3817714.htm#query=cran%20and%20people&position=37&from_view=search&track=ais&uuid=fde076d2-6daa-4f17-aede-3e9b07d9fd28">Image by lifeforstock</a> on Freepik */