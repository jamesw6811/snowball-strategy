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
        <img className={`spriteimg ${isDragging?"hidden":"visible"}`} 
          src={sprite.image} alt={sprite.name}/>
      </ViewportDiv>
    </div>
    </>
  )
  else return <span>♘</span>
}