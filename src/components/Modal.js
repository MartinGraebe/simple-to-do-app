import  React, { Component } from 'react'

export default class Modal extends Component {
    state = {
        show: false,
       
    }
  
   
   
   // Toggle Modal Container
    showModal = e => {
        let temp = this.state.show
        let set = ! temp
        this.setState({
            show: set
        })
      
    }
    
   
    
    
    render() {
        return (
            <div className="modalContainer">
              { ! this.state.show ? <button className="myButton"
                    onClick={e => {
                        this.showModal()
                    }} 
                >+</button> : null }
              {  this.state.show ? <div className="theModal">
                    <form className="modalSubmit" onSubmit={this.props.handleSubmit}>
                        <input type="text" name="toDoItem" defaultValue={this.props.value} onChange={this.props.onChangeValue} />
                        <input type="submit" className="myButton" value="Add To Do"/>
                    </form>
                    <button className="myButton"
                        onClick={e => {
                            this.showModal()
                        }} 
                    > - </button>


              </div> : null }
            </div>
        )
    }
}
