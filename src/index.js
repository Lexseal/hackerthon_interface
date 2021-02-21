import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MapApp from './App';

function generate_name() {
  let name = "";
  for (let i = 0; i < Math.random()*10; i++) {
    name += String.fromCharCode(97+Math.floor(Math.random()*26))
  }
  return name;
}

const default_user = {
  name: "Lexseal Lin",
  home_lat: null,
  home_lng: null,
  depart_time: 1,
  work_lat: null,
  work_lng: null,
  return_time: 2,
  preferece: Math.round(Math.random()*3-1),
  radius: 10,
  paired: false,
  match: null,
}

const default_people = [];
// for (let i = 0; i < 5; i++) {
//   const person = {
//     name: generate_name()+" "+generate_name(),
//     home_lat: (Math.random()-0.5)+32.8686,
//     home_lng: (Math.random()-0.5)-116.9728,
//     depart_time: 1,
//     work_lat: (Math.random()-0.5)+32.8686,
//     work_lng: (Math.random()-0.5)-116.9728,
//     return_time: 2,
//     perferece: Math.round(Math.random()*2-1),
//     radius: Math.random()*10,
//   };
//   default_people.push(person);
// }

const fetch_user = (name) => {
  fetch('http://localhost:8080/fetch/?user='+name)
   .then(response => response.json())
   .then(data => {
     console.log(data);
    ReactDOM.render(
      <React.StrictMode>
        <MapApp default_user={data} default_people={default_people}/>
      </React.StrictMode>,
      document.getElementById('root')
    );
   })
   .catch();
}

fetch_user("a qn");