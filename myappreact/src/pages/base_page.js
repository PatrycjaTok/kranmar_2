import React, { useState, useEffect } from 'react';
import { BrowserRouter as BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import request from '../utils/request';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

library.add(faArrowRotateLeft);


function LoginPanelFrame(props){

  return(
    <div className='login-panel-frame'>
      <div className='login-box px-3 pb-4'>
        <div className='logo position-absolute bg-secondary d-flex w-100 align-items-center'>
          <h5 className='text-warning px-3 my-0'>KRANMAR.pl</h5>
        </div>
        <BrowserRouter>
          <Routes>
            <Route Component={LoginPanel} path="/" />
            <Route Component={RegistryPanel} path="/registry" />
            <Route Component={ResetPasswordPanel} path="/reset_password" />
          </Routes>
        </BrowserRouter>
      </div>      
    </div>
  )
}

function LoginPanel(props) {

  return (
    <div>
      <h1 className='px-4 text-primary text-center pb-3'>Zaloguj się</h1>
      <form method='post' action=''>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Login</p>
          </div>
          <div className='col'>
            <input className='w-100' type='text' name='login'></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Hasło</p>
          </div>
          <div className='col'>
            <input className='w-100' type='password' name='password'></input>
          </div>
        </div>
        <div className='row'>
          <div className='col text-center mt-3 mt-sm-2 mt-md-1'>
            <button className='btn btn-primary w-100'>Zaloguj</button>
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

function RegistryPanel() {
  return (
    <div>
      <h1 className='px-4 text-primary text-center'>Zarejestruj się</h1>
      <p className='text-center pb-2'>Aby utworzyć konto uzupełnij poniższe pola:</p>
      <form method='post' action=''>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Imię</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='name'></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Nazwisko</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='surname'></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>E-mail</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='email'></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Login</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='text' name='login'></input>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-12 col-sm-auto'>
            <p className='my-1 my-sm-0'>Hasło</p>
          </div>
          <div className='col flex-column'>
            <input className='w-100' type='password' name='password'></input>
          </div>
        </div>
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

function ResetPasswordPanel() {
  return (
    <div>
      <h3 className='px-4 text-primary text-center'>By zresetować hasło <br></br> uzupełnij adres e-mail. </h3>
      <p className='pb-2 text-center'>Na wskazany adres e-mail zostanie wysłany link do zmiany hasła.</p>
      <form method='post' action=''>
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




function HelloWorld() {
  const [message, setMessage] = useState('');

 useEffect(() => {
   request.get('/hello-world/')
     .then(response => {
       setMessage(response.data.message);
     })
     .catch(error => {
       console.log(error);
     });
 }, []);

  return (
    <div>
      <h1 className='px-4'>Hello, World!</h1>
      <p>{message}</p>
      <button className='btn'>click</button>
    </div>
  );
}

function ByeWorld() {

  return (
    <div>
      <h1 className='px-4'>Bye, World!</h1>
      <button className='btn'>click</button>
    </div>
  );
}


export default {LoginPanelFrame, HelloWorld, ByeWorld};