import React, { useEffect, useState } from 'react';
import { Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
// Custom server urls
import baseURL from '../utils/request';
import baseURLFront from '../utils/base_url_front.js'

import Cookies from "universal-cookie";
import baseFunctions from '../utils/base_functions.js';


library.add(faArrowRotateLeft);

const cookies = new Cookies();

class LoginPanelFrame extends React.Component{

  render(){

    return(
      <div className='login-panel-frame'>
        <div className='login-box px-3 pb-4'>
          <div className='logo position-absolute bg-secondary-light d-flex w-100 align-items-center'>
            <h5 className='customTextColor px-3 my-0'>KRANMAR.pl</h5>
          </div>
            <Routes>
              <Route  element={<LoginPanel loginMethod={this.props.loginMethod} usernameValue={this.props.usernameValue} usernameOnChange={this.props.usernameOnChange} passwordValue={this.props.passwordValue} passwordOnChange={this.props.passwordOnChange} errors={this.props.errors} clearErrorsMethod={this.props.clearErrorsMethod} />} path="/" />
              <Route element={<RegistryPanel handleRegistryFormSubmit={this.props.handleRegistryFormSubmit} errors={this.props.errors} successes={this.props.successes} clearErrorsMethod={this.props.clearErrorsMethod} />} path="/registry" />
              <Route element={<ResetPasswordPanel handleRemindPasswordFormSubmit={this.props.handleRemindPasswordFormSubmit} errors={this.props.errors} successes={this.props.successes} clearErrorsMethod={this.props.clearErrorsMethod}/>} path="/reset_password"/>
              <Route element={<ResetPasswordToken/>} path="/reset-password-token"/>
              <Route path="*" element={<Navigate to ="/" />}/>
            </Routes>
        </div>
      </div>
    )
  }
}

function LoginPanel(props) {
  const location = useLocation();

  useEffect(() => {
      // execute on location change
      props.clearErrorsMethod();
  }, [location]);


  return (
    <div>
      <h1 className='px-4 text-primary text-center pb-3'>Zaloguj się</h1>
      <form onSubmit={props.loginMethod} noValidate>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Login</p>
          </div>
          <div className='col'>
            <input 
            className='w-100' 
            type='text' 
            name='login' 
            value={props.usernameValue}
            onChange={props.usernameOnChange}
            placeholder='login...'
            required></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Hasło</p>
          </div>
          <div className='col'>
            <input 
            className='w-100' 
            type='password' 
            name='password'
            value={props.passwordValue}
            onChange={function(ev){props.passwordOnChange(ev)}}
            placeholder='hasło...'
            required
            ></input>
          </div>
        </div>
        {props.errors && <small className='text-danger new-line'>{props.errors}</small>}
        <div className='row'>
          <div className='col text-center mt-3 mt-sm-2 mt-md-1'>
            <button type='submit' className='btn btn-warning w-100'>Zaloguj</button>
          </div>
        </div>
      </form>
      <div className='row mt-5 text-end'>
        <div className='col'>
          <p>Zapomniałeś hasła? <span className='fw-bold'><Link to="/reset_password">Zresetuj hasło</Link></span></p>
        </div>
      </div>
      <div className='row text-end'>
        <div className='col'>
          <p>Nie masz konta? <span className='fw-bold'><Link to="/registry">Zarejestruj się!</Link></span></p>
        </div>
      </div>
    </div>
  );
}

function RegistryPanel(props) {
  const location = useLocation();

  useEffect(() => {
      // execute on location change
      props.clearErrorsMethod();
  }, [location]);

  return (
    <div>
     <h3 className='px-4 text-primary text-center'>Sekcja niedostępna. <br></br>W celu utworzenia konta skontaktuj się z administratorem.</h3>
      {/* <h1 className='px-4 text-primary text-center'>Zarejestruj się</h1>
      <p className='text-center pb-0 mb-0'>Aby utworzyć konto uzupełnij poniższe pola:</p>
      <h5 className='bg-success registry-succes-message text-center fw-bolder mb-0 mt-1'>{props.successes && <span>{props.successes}</span>}</h5>
      <p className="bg-success registry-succes-message text-center">{props.successes && <span>Zostaniesz przekierowany na stronę logowania</span>}</p>
      <form onSubmit={props.handleRegistryFormSubmit} noValidate>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Imię</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='name' placeholder='Imię...' required></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Nazwisko</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='surname' placeholder='Nazwisko...' required></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>E-mail</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='email' placeholder='Adres e-mail...' required></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Login</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='login' placeholder='Login...' required></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Hasło</p>        
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='password' name='password1' placeholder='hasło...' required></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Powtórz hasło</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='password' name='password2' placeholder='hasło...' required></input>
          </div>
        </div>
        <small className='customTextlight'>(Hasło: a-z, 0-9, znaki specjalne: -._*)</small>
        {props.errors && <p className='mb-0 pb-0'><small className='text-danger new-line'>{props.errors}</small></p>}
        <div className='row'>
          <div className='col text-center mt-3 mt-sm-2 mt-md-1'>
            <button className='btn btn-warning w-100'>Wyślij</button>
          </div>
        </div>
      </form> */}
      <div className='row'>
        <div className='col text-start pt-4'>
          <span className='text-primary'><FontAwesomeIcon icon={faArrowRotateLeft} /> </span>
          <Link to="/">Wróć</Link>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPanel(props) {
  const location = useLocation();
  
  useEffect(() => {
      // execute on location change
      props.clearErrorsMethod();
  }, [location]);

  return (
    <div>
      {/* <h3 className='px-4 text-primary text-center'>Sekcja w trakcie realizacji.</h3> */}
      <h4 className='px-4 text-primary text-center'>By zresetować hasło </h4>
      <h5 className='px-4 text-primary text-center'>wprowadź adres e-mail podany podczas rejestracji konta. </h5>
      <p className='pb-2 text-center'>Następnie zaloguj się na podane konto e-mail i sprawdź skrzynkę odbiorczą.</p>
      <h5 className='bg-success remind-password-succes-message text-center fw-bolder mb-0 mt-1'>{props.successes && <span>{props.successes}</span>}</h5>
      <p className="bg-success remind-password-succes-message text-center">{props.successes && <span>Zostaniesz przekierowany.</span>}</p>
      <form method='post' onSubmit={props.handleRemindPasswordFormSubmit} noValidate>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>E-mail</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='email' required></input>
          </div>
        </div>
        {props.errors && <p className='mb-0 pb-0'><small className='text-danger new-line'>{props.errors}</small></p>}
        <div className='row'>
          <div className='col text-center mt-3 mt-sm-2 mt-md-1'>
            <button className='btn btn-primary w-100'>Wyślij</button>
          </div>
        </div>
      </form>
      <div className='row'>
        <div className='col text-start pt-4'>
          <span className='text-primary'><FontAwesomeIcon icon={faArrowRotateLeft} /> </span>
          <Link to="/">Wróć</Link>
        </div>
      </div>
    </div>
  );
}

class ResetPasswordToken extends React.Component {
  constructor(props){
    super(props);
    this.state={
      successes: '',
      errors: '',
      password_token: {used_attempts: 3},
      showForm: true
    }
    this.handleChangePasswordFormSubmit = this.handleChangePasswordFormSubmit.bind(this);
  }

  fetchData = () =>{
    let self = this;
    const searchParams = new URLSearchParams(window.location.search);
    let url_token = searchParams.get('url_tk'); 

    if(!url_token || url_token.length === 0){return}

    $.ajax({
        url: baseURL + '/get-password-token-by-url/',
        method: 'POST',
        dataType: 'json',
        // async: false,
        headers: {
          "Content-Type": 'application/json',
          "X-CSRFToken": cookies.get("csrftoken")
        },
        data: JSON.stringify({"url_token": url_token}),
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            if(data.password_token){self.setState({password_token: data.password_token})}
            if(data.messages.errors){
              self.setState({errors: data.messages.errors, showForm: false});
            }
            if(data.messages.success){
              self.setState({successes: data.messages.success, showForm: true})
            }
        },
        error: function(xhr, status, err) {
            let errorText = xhr.responseJSON.messages.errors;   
            withReactContent(Swal).fire({
                title: errorText,
                showConfirmButton: false,
                icon: 'error',
                timer: 5000,
                // timerProgressBar: true
            })                       
        }
    });
  }

  handleChangePasswordFormSubmit(event){
    event.preventDefault();
    let self = this;
    let evTarget = $(event.target);

    let validation = baseFunctions.formValidation(evTarget)

    if(validation.validation){
      // check if password inpts exist and has the same value
      let passwordInput = evTarget.find('input[namae="password"]');
      let passwordInput2 = evTarget.find('input[namae="password2"]');
      let passwordInputVal = passwordInput.val();
      let passwordInputVal2 = passwordInput2.val();

      if(passwordInputVal !== passwordInputVal2){
        passwordInput.addClass('invalid');
        passwordInput2.addClass('invalid');
        self.setState({errors: 'Podane hasła nie są takie same'})
        return;
      }else{
        passwordInput.removeClass('invalid');
        passwordInput2.removeClass('invalid');
        self.setState({errors: ''})
      }

      const data = new FormData(event.target);
      const searchParams = new URLSearchParams(window.location.search);
      let url_token = searchParams.get('url_tk'); 

      if(!url_token || url_token.length === 0){return}

      data.append( "url_token", url_token );
      const objectData = JSON.stringify(Object.fromEntries(data.entries()));

      $.ajax({
        url: baseURL + '/reset-password-change-password/',
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
          self.setState({
            successes: data.messages.success,
            errors: '',
          });

          setTimeout(() => {
            window.location.replace(baseURLFront + '/');
          }, 4000);            
        }.bind(this),
        error: function(xhr, status, err) {
          console.log('ERROR')
          let errorText = xhr.responseJSON.messages.errors;
          self.setState({errors: errorText})
          self.fetchData();
          
        }.bind(this)
      });

    }else{
      let errorText = '';
      for(let i=0; i< validation.errors.length; i++){
        errorText += validation.errors[i];
        if(i < validation.errors.length -1){errorText += '\n'}
      }
      console.log(errorText)
      self.setState({errors: errorText})
    }
  }

  componentDidMount(){
    this.fetchData();
  }

  render(){
    return (
    <div>
      {this.state.showForm && <div>
      <h3 className='px-4 text-primary text-center'>By zresetować hasło <br></br> wpisz kod wysłany na adres e-mail <br></br>oraz nowe hasło</h3>
      <p className='text-secondary'>Dosętpne próby: {this.state.password_token.used_attempts}</p>
      <h5 className='bg-success remind-password-succes-message text-center fw-bolder mb-0 mt-1'>{this.state.successes && <span>{this.state.successes}</span>}</h5>
      <p className="bg-success remind-password-succes-message text-center">{this.state.successes && <span>Zostaniesz przekierowany na stronę logowania.</span>}</p>
        <form method='post' onSubmit={this.handleChangePasswordFormSubmit} noValidate>
          <div className='row mb-3'>
            <div className='col-12 col-sm-auto'>
              <p className='my-1 my-sm-0'>Kod</p>
            </div>
            <div className='col flex-column'>
              <input className='w-100' type='text' name='change_password_token' required></input>
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-12 col-sm-auto'>
              <p className='my-1 my-sm-0'>Nowe hasło</p>
            </div>
            <div className='col flex-column'>
              <input className='w-100' type='password' name='password' required></input>
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-12 col-sm-auto'>
              <p className='my-1 my-sm-0'>Powtórz nowe hasło</p>
            </div>
            <div className='col flex-column'>
              <input className='w-100' type='password' name='password2' required></input>
            </div>
          </div>
          {this.state.errors && <p className='mb-0 pb-0'><small className='text-danger new-line'>{this.state.errors}</small></p>}
          <div className='row'>
            <div className='col text-center mt-3 mt-sm-2 mt-md-1'>
              <button className='btn btn-primary w-100'>Wyślij</button>
            </div>
          </div>
        </form>
        <div className='row'>
          <div className='col text-start pt-4'>
            <span className='text-primary'><FontAwesomeIcon icon={faArrowRotateLeft} /> </span>
            <Link to="/">Wróć</Link>
          </div>
        </div>
        </div>}

        {!this.state.showForm && <div>
          {this.state.errors && <h3 className='mb-0 pb-0'><small className='text-danger new-line'>{this.state.errors}</small></h3>}
          <div className='row'>
            <div className='col text-start pt-4'>
              <span className='text-primary'><FontAwesomeIcon icon={faArrowRotateLeft} /> </span>
              <Link to="/">Wróć</Link>
            </div>
          </div>
        </div>}

    </div>
  );
  }
}

const exportedObject = {
  LoginPanelFrame,
};

export default exportedObject;