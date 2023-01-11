import React from 'react'
import ViewportDiv from './ViewportDiv'
import {useDrag} from 'react-dnd'
import './Sprite.css'

export default function Sprite({id, sprite, type}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }),[sprite])

  if (sprite.image) return (
    <>
    <div ref={drag} className="tooltip">
      <span className="tooltiptext">{sprite.name}</span>
      <ViewportDiv viewportHeight={9} viewportWidth={9}>
        <img src={sprite.image} alt={sprite.name} style={{position:"absolute", 
          height:"100%", 
          width:"100%", 
          visibility:isDragging?"hidden":"visible",
          top:"-50%", left:"-50%",
          cursor: "move"}}/>
      </ViewportDiv>
    </div>
    </>
  )
  else return <span>♘</span>
}