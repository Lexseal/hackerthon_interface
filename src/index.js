import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MapApp from './App';
import ParticlesBg from 'particles-bg'

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

const fetch_user = (name, pass) => {
  fetch(`http://localhost:8080/login/?user=${name}&pass=${pass}`)
   .then(response => response.json())
   .then(data => {
     if (data != null && data.length != 0) {
      console.log(data);
      ReactDOM.render(
      <React.StrictMode>
        <MapApp default_user={data} default_people={default_people}/>
      </React.StrictMode>,
      document.getElementById('root')
      );
     } else {
       alert("wrong user or password");
     }
   })
   .catch(() => alert("wrong user or password"));
}

let user_name;
let password;

ReactDOM.render(
  <React.StrictMode>
    <h1 id="login-title">Neighbor Ride Share (NRS)</h1>
    <div className="login">
      <div>
        <span>Name:</span>
        <input className="inputs" id="user" onChange={(e) => {
          user_name = e.target.value;
        }}></input>
      </div>
      <div>
        <span>Password:</span>
        <input className="inputs" id="pass" type="password" onChange={(e) => {
          password = e.target.value;
        }}></input>
      </div>
      <button onClick={() => {
        document.getElementById("user").value = "";
        document.getElementById("pass").value = "";
        fetch_user(user_name, password);
      }}>Login</button>
    </div>
    <ParticlesBg type="circle" bg={true} />
  </React.StrictMode>,
  document.getElementById('root')
);

//ptfij vspo '0.7827192785440196'
//rrdh ebmwo '0.14626640126255985'
// bmeop r 0.6319558339108031
// fgnkg abk 0.8382239400361933