import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./Constants";

export default function SpriteDropCatcher({children, handleDrop}){
    const catcherRef = useRef();

    const [, drop] = useDrop(
        () => ({
          accept: [ItemTypes.SPRITE, ItemTypes.PALETTE],
          drop(item, monitor) {
            const dropOffset = monitor.getClientOffset();
            const type = monitor.getItemType();
            handleDrop({id:item.id, dropOffset, type, 
                latestBounds:catcherRef.current.getBoundingClientRect()});
            return undefined
          }
        }), [handleDrop]
      )

    return <div ref={drop} style={{width:"100%", height:"100%"}}>
            <div ref={catcherRef} style={{width:"100%", height:"100%"}}>
                {children}
            </div>
        </div>
}