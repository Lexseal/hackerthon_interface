import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  //Geocoder,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 32.715736,
  lng: -117.161087, // san diego location
};

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
  work_lat: (Math.random()-0.5)+32.8686,
  work_lng: (Math.random()-0.5)-116.9728,
  return_time: 2,
  perferece: Math.round(Math.random()*3-1),
  radius: Math.random()*5,
}

const default_people = [];
for (let i = 0; i < 5; i++) {
  const person = {
    name: generate_name()+" "+generate_name(),
    home_lat: (Math.random()-0.5)+32.8686,
    home_lng: (Math.random()-0.5)-116.9728,
    depart_time: 1,
    work_lat: (Math.random()-0.5)+32.8686,
    work_lng: (Math.random()-0.5)-116.9728,
    return_time: 2,
    perferece: Math.round(Math.random()*2-1),
    radius: Math.random()*5,
  };
  default_people.push(person);
}

export default function MapApp() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [user, setUser] = React.useState(default_user);
  const [people, setPeople] = React.useState(default_people);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    setPeople((current) => [
      ...current,
      {
        name: "John Doe",
        home_lat: e.latLng.lat(),
        home_lng: e.latLng.lng(),
        depart_time: 1,
        work_lat: e.latLng.lat(),
        work_lng: e.latLng.lng(),
        return_time: 2,
        perferece: 0,
        radius: 1,
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const set_home = React.useCallback(({ lat, lng }) => {
    setUser((user) => ({...user, home_lat: lat, home_lng: lng}));
  }, []);

  const set_work = React.useCallback(({ lat, lng }) => {
    setUser((user) => ({...user, work_lat: lat, work_lng: lng}));
  }, []);

  const set_depart_time = (event) => {
    let time = event.target.value;
    let date = new Date("1970-01-01 " + time);
    if (date === "Invalid Date") return;

    time = parseInt(date.getHours())*60+parseInt(date.getMinutes());
    setUser((user) => ({...user, depart_time: time}));
  };

  const set_return_time = (event) => {
    let time = event.target.value;
    let date = new Date("1970-01-01 " + time);
    if (date === "Invalid Date") return;

    time = parseInt(date.getHours())*60+parseInt(date.getMinutes());
    setUser((user) => ({...user, return_time: time}));
  };

  const set_preference = (e) => {
    console.log(e.target.value);
    setUser({...user, preference: parseInt(e.target.value)});
  }

  const set_radius = (e) => {
    console.log(e.target.value);
    setUser({...user, radius: parseInt(e.target.value)});
  }

  const userUpdateOptions = {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(user),
  };

  fetch('http://localhost:8080/', userUpdateOptions)
     .then(response => response.json())
     .then(data => {
       console.log(data);
     })
     .catch();

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <h1>
        Ride {" "}
        <span role="img" aria-label="car">
          🚗
        </span>
      </h1>

      <Locate panTo={panTo} />
      <div className="settings">
        <SearchHome panTo={panTo} set_home={set_home} />
        <div>
          <span>Depart:</span>
          <input className="inputs" onChange={set_depart_time}></input>
        </div>
        <SearchWork panTo={panTo} set_work={set_work} />
        <div>
          <span>Return:</span>
          <input className="inputs" onChange={set_return_time}></input>
        </div>
        <div>
          <span>Preference:</span>
          <select name="preference" id="preference" onChange={set_preference}>
            <option value="1">Drive</option>
            <option value="0">Neutral</option>
            <option value="-1">Ride</option>
          </select>
        </div>
        <div>
          <span>Radius:</span>
          <input className="inputs" type='text' onChange={set_radius}></input>
        </div>
      </div>

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={options}
        //onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {people.map((person) => (
          <Marker
            key={`${person.home_lat}-${person.home_lng}`}
            position={{ lat: person.home_lat, lng: person.home_lng }}
            onClick={() => {
              setSelected(person);
            }}
            icon={{
              url: `car${Math.floor(parseFloat(person.home_lat)*100000)%3+1}.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {user.home_lat != null ? (
          <Marker
            key={`${user.home_lat}-${user.home_lng}`}
            position={{ lat: user.home_lat, lng: user.home_lng }}
            onClick={() => {
              setSelected(user);
            }}
            icon={{
              url: `home.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />) : null}

        {user.work_lat != null ? (
          <Marker
            key={`${user.work_lat}-${user.work_lng}`}
            position={{ lat: user.work_lat, lng: user.work_lng }}
            icon={{
              url: `work.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />) : null}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.home_lat, lng: selected.home_lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>
                {selected.name}
                <button className="pair-button">Pair</button>
              </h2>
              <p>Home: {parseFloat(selected.home_lat).toFixed(4)}, {parseFloat(selected.home_lng).toFixed(4)}</p>
              <p>Work: {parseFloat(selected.work_lat).toFixed(4)}, {parseFloat(selected.work_lng).toFixed(4)}</p>
              <p>Departure: {selected.depart_time}</p>
              <p>Return: {selected.return_time}</p>
              <p>Preference: {selected.perferece}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
}

function SearchHome({ panTo, set_home }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 32.715736, lng: () => -117.161087 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
      set_home({ lat, lng });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search home"
      />
      <ComboboxPopover className="suggestion">
        <ComboboxList>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}

function SearchWork({ panTo, set_work }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 32.715736, lng: () => -117.161087 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
      set_work({ lat, lng });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="search-work">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search work"
        />
        <ComboboxPopover className="suggestion">
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}