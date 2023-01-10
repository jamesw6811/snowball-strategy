import React from 'react';
import infoIcon from './images/infoicon.png';

export default function InfoButton({onClick}){
    return <div onClick={onClick}>
        <ViewportDiv viewportHeight={3} viewportWidth={3}>
            <img style={{width:"100%", height:"100%"}} src={infoIcon} alt="info"/>
        </ViewportDiv>
    </div>
}