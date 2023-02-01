import React from "react";
import './ResultsDisplay.css';

export default function ResultsDisplay({results, onClick}){
    if (results)
        return <div className="resultsdisplayoverlay" onClick={onClick}>
                <div className="resultsdisplay">
                    <span className="resultsspan">
                        {results}
                    </span>
                </div>
        </div>
    else return <></>
    
}

