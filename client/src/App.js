/* eslint-disable import/no-webpack-loader-syntax */
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import moment from 'moment';
import './App.scss';
import Login from './components/Login';
import Register from './components/Register';
import mapboxgl from 'mapbox-gl';
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [newPlace, setNewPlace] = useState({
    long: "",
    lat: "",
  })
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [ viewport, setViewport ] = useState({
    latitude: "",
    longitude: "",
    zoom: 14,
  });
  const [ notes, setNotes ] = useState([]);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8080/api/notes");
        setNotes(res.data);
        
      } catch (error) {
        console.log(error);
      }
    }
    getNotes();
  },[]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewport({
        ...viewport,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, [viewport]);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({
      ...viewport,
      latitude: lat,
      longitude: long,
    })
  }

  const handleAddMarker = (e) => {
    const {lng, lat} = e.lngLat;
    setNewPlace({
      long: lng,
      lat: lat
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newNote = {
      username: currentUser,
      title,
      description,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post("http://127.0.0.1:8080/api/notes", newNote);
      setNotes([...notes, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }
  

  return (
    <>
      {viewport.latitude && viewport.longitude && (
        <div>
          {currentUser ? (<button type="submit" className="btn logout" onClick={handleLogout}>Log out</button>) : (
            <div className="buttons">
            <button type="submit" className="btn login" onClick={() => setShowLogin(true)}>Login</button>
            <button type="submit" className="btn register" onClick={() => setShowRegister(true)}>Register</button>
          </div>
          )}
          {showRegister && <Register setShowRegister={setShowRegister} />}
          {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
          
          <Map
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            initialViewState={viewport}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            style={{ width: "100vw", height: "100vh"}}
            onDblClick={handleAddMarker}
          > 
              <Marker
              longitude={viewport.longitude}
              latitude={viewport.latitude}
              >
              <LocationOnIcon 
                style={{
                  fontSize: viewport.zoom * 3, 
                  color: currentUser ? "tomato" : "blueviolet",
                  cursor: "pointer"
                }} 
              />
            </Marker> 
            
            {notes.map(note => (
              <React.Fragment key={note._id}>
              <Marker
              longitude={note.long}
              latitude={note.lat}
              onClick={() => handleMarkerClick(note._id, note.lat, note.long)}
              >
              <LocationOnIcon 
                style={{
                  fontSize: viewport.zoom * 3, 
                  color: note.username === currentUser ? "tomato" : "blueviolet",
                  cursor: "pointer"
                }} 
              />
              </Marker> 
              {
                note._id === currentPlaceId && (
                <Popup longitude={note.long} latitude={note.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card" key={note._id}>
                    <label>Place</label>
                    <h4 className="place">{note.title}</h4>
                    <label>Review</label>
                    <p>{note.description}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(note.rating).fill(<StarIcon className="Star"/>)}
                    </div>
                    <label>Information</label>
                    <span className="username">Created by <b>{note.username}</b></span>
                    <span className="date">{moment().format(note.createAt)}</span>
                  </div>
                </Popup>
                )
              }
              
              </React.Fragment>
            ))}

            {newPlace && (
              <Popup longitude={newPlace.long} latitude={newPlace.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              >
                <div>
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <label>Title</label>
                    <input type="text" placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)}/>
                    <label>Review</label>
                    <textarea placeholder="Say us something about this place" onChange={(e) => setDescription(e.target.value)}/>
                    <label>Rating</label>
                    <select onChange={(e) => setRating(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <button type="submit" className="submit-btn">Add Note</button>
                  </form>
                  </div>
              </Popup>
            )}
            
            
          </Map>
          
        </div>
      )}
    </>
  )
}

export default App;