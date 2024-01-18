import React, { useState, useEffect } from 'react';
import request from '../utils/request';

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


export default {HelloWorld, ByeWorld};