import { AppContext } from '../App';
import { useContext } from 'react';

function Info() {
    const {state} = useContext(AppContext);
    return (
            <ul className='EgCities'>
                <li><h4>Location : {`${state.data.name}`} {`${state.data.sys.country}`}</h4></li>
                <li>Humidity : {`${state.data.main.humidity}%`}</li>
                <li>Wind Speed : {`${state.data.wind.speed}km/h`}</li>
                <li>Clouds : {`${state.data.clouds.all}%`}</li>
                <li>Description : {`${state.data.weather[0].description}`}</li>
            </ul>
    );
}
export default Info;