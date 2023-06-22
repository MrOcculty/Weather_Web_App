import React, { useReducer, createContext, useEffect } from 'react';
import LeftBox from './assets/LeftBox';
import Info from './assets/Info';
import './styles.css';
import axios from 'axios';

const key = import.meta.env.VITE_REACT_APP_SECRET_KEY;

export const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'setData': return { ...state, data: action.payload };
    case 'setImageUrl': return { ...state, imageUrl: action.payload };
    case 'setIconUrl': return { ...state, iconUrl: action.payload };
    case 'setCity': return { ...state, city: action.payload };
  }
}

export default function App() {



  const [state, dispatch] = useReducer(reducer, { city: 'delhi', data: null, imageUrl: './Photos/Normal.jpg', iconUrl: '' });

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${state.city}&appid=${key}`;

  // ------------------------on load---------------------------

  useEffect(() => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(showLocation);
    else
      alert("Couldn't Load Your Loacation 😞");
  }, [])

  const showLocation = async (position) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}`);
      dispatch({ type: 'setData', payload: response.data });
      dispatch({ type: 'setIconUrl', payload: `./Icons/${response.data.weather[0].main}.png` });
      setImage(response.data.weather[0].main);
    }
    catch (error) {
      console.log(error);
      fetchWeather()
    }
  }
  // -----------------------------on search----------------------------
  const fetchWeather = async () => {
    try {
      const response = await axios.get(url);
      dispatch({ type: 'setData', payload: response.data });
      dispatch({ type: 'setIconUrl', payload: `./Icons/${response.data.weather[0].main}.png` });
      setImage(response.data.weather[0].main, response.data.clouds.all);
    }
    catch (error) {
      console.log(error);
    }
  }

  // -----------------------------load background image---------------------------
  const setImage = (weather, clouds) => {
    if (clouds > 65)
      dispatch({ type: 'setImageUrl', payload: './Photos/Clouds.jpg' });
    else {
      switch (weather) {
        case "Rain": dispatch({ type: 'setImageUrl', payload: './Photos/Rain.jpg' });
          break;
        case "Thunderstorm": dispatch({ type: 'setImageUrl', payload: './Photos/Thunderstorm.jpg' });
          break;
        case "Tornado": dispatch({ type: 'setImageUrl', payload: './Photos/Tornado.jpg' });
          break;
        default: dispatch({ type: 'setImageUrl', payload: './Photos/Normal.jpg' });
      }
    }
  }

  // --------------------------app component code---------------------------
  return (
    <AppContext.Provider value={{ state }} >
      <div className='window' style={{ backgroundImage: `url(${state.imageUrl})` }}>
        <div className='bgBlur' >
          <div className='container' style={{ backgroundImage: `url(${state.imageUrl}` }}>
            <div className='box'>
              {state.data ? <LeftBox /> : <></>}
            </div>
            <div className='rightMenu'>
              <p>
                <input
                  type="text"
                  id='CityNameTextBox'
                  className='noBorderOutline'
                  placeholder='Search City'
                  onChange={event => dispatch({ type: 'setCity', payload: event.target.value })}
                  onKeyDown={event => event.key === "Enter" && fetchWeather()}
                />

                <button id='searchBtn' className='noBorderOutline' onClick={fetchWeather}>
                  <img src="./Icons/Search.png" style={{ width: '30px' }} />
                </button>
              </p>
              {state.data && <><hr className='hrTags noBorderOutline' />
                <p className='center' ><img src={state.iconUrl} style={{ width: '150px', marginTop: '20px' }} /></p>
                <p className='center mobtemp'><span>{`${Math.round(state.data.main.temp - 273.15)}C°`}</span></p>
                <p className='center' style={{ marginBottom: '20px' }}>{state.data?.weather[0].main}</p></>}
              <hr className='hrTags noBorderOutline' />
              {state.data ? <Info /> : <></>}
              {!state.data && <img src='./Photos/SearchBackground.png' className='noDataImg' alt='' />}
              {state.data && <hr className='hrTags noBorderOutline' />}
            </div>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}