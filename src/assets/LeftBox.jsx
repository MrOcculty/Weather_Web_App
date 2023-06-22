import { AppContext } from '../App';
import { useContext } from 'react';

function LeftBox() {
    const { state } = useContext(AppContext);
    const date = new Date((state.data.dt) * 1000);
    return (
        <div className='DataInShort'>
            <p className='degree'>{`${Math.round(state.data.main.temp - 273.15)}°`}</p>
            <div className='cityNdate'>
                <p className='CityName'>{state.data.name} </p>
                <p className='date'> {date.toDateString()}</p>
            </div>

        </div>
    );
}

export default LeftBox;