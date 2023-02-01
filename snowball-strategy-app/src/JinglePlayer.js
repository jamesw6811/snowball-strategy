import React from "react";
import letitwomp from './sound/letitwomp.mp3';
import './JinglePlayer.css';

export default function JinglePlayer() {
    return <audio className="audioplayer" controlsList="play" controls loop>
        <source src={letitwomp} type="audio/mpeg" />
        </audio>
}