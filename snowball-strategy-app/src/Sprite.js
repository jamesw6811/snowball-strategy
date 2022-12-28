import React from 'react'
import ViewportDiv from './ViewportDiv'
import {useDrag} from 'react-dnd'

export default function Sprite({id, image, altText="", type}) {

  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }),[id, type])

  if (image) return (
    <div ref={drag}>
      <ViewportDiv viewportHeight={5} viewportWidth={5}>
        <img src={image} alt={altText} style={{position:"absolute", 
          height:"100%", 
          width:"100%", 
          visibility:isDragging?"hidden":"visible",
          top:"-50%", left:"-50%",
          cursor: "move"}}/>
      </ViewportDiv>
    </div>
  )
  else return <span>♘</span>
}