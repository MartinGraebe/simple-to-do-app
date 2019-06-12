import React, { Component } from 'react'
import Tasks from './Tasks'
import examples from './examples'
import Modal from './Modal'


class LandingZone extends Component {

    constructor(){
        super()
        this.state = {
            tasks: examples,
            toDo: [],
            inProgress: [],
            done: [],
            newToDo: 'add here',
           
        }
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.updateTasks = this.updateTasks.bind(this)
        this.saveToLocal = this.saveToLocal.bind(this)
        this.loadLocal = this.loadLocal.bind(this)
        this.resetStorage = this.resetStorage.bind(this)
        this.addTask = this.addTask.bind(this)
        this.handleChangeNew = this.handleChangeNew.bind(this)
    }
   async componentDidMount(){
        await this.loadLocal()
        this.updateTasks()
        
    }
     componentDidUpdate(){
    
    }
    async updateTasks(){
        const {tasks} = this.state
        let all = [], open = [], working = [], completed = []
        all = tasks
       await all.forEach(t => {
            if (t.status === 'toDo') {
                open.push(t)
            }
            if (t.status === 'inProgress') {
                working.push(t)
            }
            if (t.status === 'done') {
                completed.push(t)
            }
            
        })
    
        this.setState({
            toDo: open,
            inProgress: working,
            done: completed
        })
    }
    saveToLocal = () => {
        const toSave = this.state.tasks
        
        localStorage.setItem('tasklist', JSON.stringify(toSave))

    }
   
   async loadLocal() {
        let stored
        if (localStorage.getItem('tasklist')){

            stored = JSON.parse(localStorage.getItem('tasklist'))
            this.setState( {

                tasks: stored
            })
           
       
        }
      

        
    }
    async resetStorage(){
        localStorage.removeItem('tasklist')
        let all = this.state.tasks
        all.forEach(t => {
            t.status = 'toDo'
        })
        
        this.setState({
            tasks: all
        })
      
       this.updateTasks()

    }
    async addTask(event){
        const {tasks} = this.state
        let temp = tasks
        let time = new Date()
        let mseconds = time.getMilliseconds()
        let minutes = time.getMinutes()
        let random = Math.floor(Math.random()* 5 * mseconds + minutes)
        let toAdd = this.state.newToDo
        let add = {id: random, taskName: toAdd, backImage: 'not active yet', bgcolor: "#3066be", status: 'toDo'}

        temp.push(add)
        this.setState({
            tasks: temp
        })
        event.preventDefault()
        console.log(this.state.tasks)
        this.updateTasks()
    }
    onDragStart = (event, id) =>{

       
        event.dataTransfer.setData("id", id)
    }
    onDragOver = (event)  =>{
        event.preventDefault()
    }

    onDrop = (event, category) => {

        let id = parseInt(event.dataTransfer.getData('id'))
   
       
       
           let blub = this.state.tasks
           let filtered = blub.filter((el) => {

            if (el.id === id) {
                
                el.status = category
            } 
            return el
           })
   
       
        this.setState({
            tasks: filtered
            
        })
        this.updateTasks()
        this.saveToLocal()

    }
    handleChangeNew(ev) {
    
        this.setState({
            newToDo: ev.target.value
        })
    }

   

    render(){
       const {toDo, inProgress, done} = this.state
       let open = toDo.map(item => <Tasks key={item.id} item={item} handleChange = {this.onDragStart} style = {{backgroundColor: item.bgcolor}} />)
       let working = inProgress.map(item => <Tasks key={item.id} item={item} handleChange = {this.onDragStart} style = {{backgroundColor: item.bgcolor}} />)
       let completed = done.map(item => <Tasks key={item.id} item={item} handleChange = {this.onDragStart} style = {{backgroundColor: item.bgcolor}} />)

        return(

            <div className="mainContainer" >
                <div className="menuContainer">
                    <div><button className="myButton" onClick={this.resetStorage}>Reset</button></div>
                    <Modal 
                        handleSubmit={this.addTask}
                        value={this.state.newToDo}
                        onChangeValue={this.handleChangeNew}
                        />
                      
                </div>
              <div className="listContainer">
                <div className="toDo common" draggable
                     onDragOver={(event)=> this.onDragOver(event)}
                     onDrop={(event) =>{this.onDrop(event, "toDo")}}
                >
                    <span>To Do</span>

                    {open}
                </div>
                <div className="inProgress common" draggable
                        onDragOver={(event)=> this.onDragOver(event)}
                        onDrop={(event) =>{this.onDrop(event, "inProgress")}}
                
                
                
                
                >
                    <span>In Progress</span>
                    {working}
                </div>
                <div className="done common" draggable
                         onDragOver={(event)=> this.onDragOver(event)}
                         onDrop={(event) =>{this.onDrop(event, "done")}}
                >
                    <span>Done</span>
                    {completed}

                </div>

              </div>
            </div>
        )
    }


}
export default LandingZone