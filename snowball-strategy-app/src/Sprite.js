import React from 'react'
import ViewportDiv from './ViewportDiv'

export default function Sprite({image, altText=""}) {
  if (image) return (
  <ViewportDiv viewportHeight={5} viewportWidth={5}>
    <img src={image} alt={altText} style={{position:"absolute", height:"100%", width:"100%", top:"-50%", left:"-50%"}}/>
  </ViewportDiv>
  )
  else return <span>♘</span>
}