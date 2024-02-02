import React, { useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
// import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";


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
              <Route element={<ResetPasswordPanel clearErrorsMethod={this.props.clearErrorsMethod} />} path="/reset_password"/>
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
            <button type='submit' className='btn btn-primary w-100'>Zaloguj</button>
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
      <h1 className='px-4 text-primary text-center'>Zarejestruj się</h1>
      <p className='text-center pb-0 mb-0'>Aby utworzyć konto uzupełnij poniższe pola:</p>
      <h5 className='text-success text-center fw-bolder mb-0 mt-1'>{props.successes && <span>{props.successes}</span>}</h5>
      <p className="text-success text-center">{props.successes && <span>Zostaniesz przekierowany na stronę logowania</span>}</p>
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

function ResetPasswordPanel(props) {
  // const location = useLocation();

  // useEffect(() => {
  //     // execute on location change
  //     props.clearErrorsMethod();
  // }, [location]);

  return (
    <div>
    {/* TODO: RESET PASSWORD */}
      <h3 className='px-4 text-primary text-center'>Sekcja w trakcie realizacji.</h3>
      {/* <h3 className='px-4 text-primary text-center'>By zresetować hasło <br></br> uzupełnij adres e-mail. </h3>
      <p className='pb-2 text-center'>Na wskazany adres e-mail zostanie wysłany link do zmiany hasła.</p>
      <form method='post' action='/reset-password/'>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>E-mail</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='email'></input>
          </div>
        </div>
        <div className='row'>
          <div className='col text-center mt-3 mt-sm-2 mt-md-1'>
            <button className='btn btn-primary w-100'>Wyślij</button>
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

const exportedObject = {
  LoginPanelFrame,
};

export default exportedObject;