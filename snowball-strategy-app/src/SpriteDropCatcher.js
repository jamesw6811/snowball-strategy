import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./constants";
import './SpriteDropCatcher.css';

export default function SpriteDropCatcher({children, handleDrop}){
  const catcherRef = useRef();

  const [, drop] = useDrop(() => ({
      accept: [ItemTypes.BOARDSPRITE, ItemTypes.PALETTESPRITE],
      drop(item, monitor) {
        const dropOffset = monitor.getClientOffset();
        const type = monitor.getItemType();
        handleDrop({id:item.id, dropOffset, type, 
            latestBounds:catcherRef.current.getBoundingClientRect()});
        return undefined
      }
    }), [handleDrop]
  )

  return <div ref={drop} className="spritedropcatcher">
      <div ref={catcherRef} className="spritedropcatcher">
        {children}
      </div>
    </div>
}