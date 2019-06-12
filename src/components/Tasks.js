import React from 'react'

function Tasks(props){

    return(
        <div className="Tasks"
                key={props.item.id}
                draggable
                onDragStart = {(ev)=>props.handleChange(ev, props.item.id)}
                style = {{backgroundColor: props.item.bgcolor}}
        
        
        
        >
        <span>{props.item.taskName}</span>
            



        </div>

    )
}

export default Tasks