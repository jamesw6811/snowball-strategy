import React from 'react';
import infoIcon from './images/infoicon.png';
import './InfoButton.css';

export default function InfoButton({onClick}){
    return <div onClick={onClick}>
            <img className="infobutton" src={infoIcon} alt="info"/>
    </div>
}