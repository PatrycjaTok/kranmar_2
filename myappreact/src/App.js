import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter as BrowserRouter, Route, Routes, redirectDocument } from 'react-router-dom';
// import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import './main.css';
import CustomPages from './pages/base_page.js';


function App() {

  if(1){
  
    return(
      <div>
        <CustomPages.LoginPanelFrame/>
      </div>
    )
  }

  return (
    <div>
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

{/* <a href="https://www.freepik.com/free-photo/construction-site-building_3817714.htm#query=cran%20and%20people&position=37&from_view=search&track=ais&uuid=fde076d2-6daa-4f17-aede-3e9b07d9fd28">Image by lifeforstock</a> on Freepik */}