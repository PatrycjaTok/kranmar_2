import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter as BrowserRouter, Route, Routes } from 'react-router-dom';
// import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import './main.css';
import CustomPages from './pages/main_react_app.js';

function App() {
  return (
    <div>
    {/* <CustomPages.HelloWorld/> */}
      <BrowserRouter>
        <Routes>
          <Route Component={CustomPages.HelloWorld} path="/" />
          <Route Component={CustomPages.ByeWorld} path="/bye" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;