import React, { useState, useEffect } from 'react';
import { BrowserRouter as BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import request from '../utils/request';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

library.add(faArrowRotateLeft);


function Dashboard(props){

  return(
    <div className='login-panel-frame'>
      <div className='login-box px-3 pb-4'>
        <div className='logo position-absolute bg-secondary d-flex w-100 align-items-center'>
          <h5 className='text-warning px-3 my-0'>KRANMAR.pl</h5>
        </div>
//        <BrowserRouter>
//          <Routes>
//            <Route Component={LoginPanel} path="/" />
//            <Route Component={RegistryPanel} path="/registry" />
//            <Route Component={ResetPasswordPanel} path="/reset_password" />
//          </Routes>
//        </BrowserRouter>
      </div>
    </div>
  )
}