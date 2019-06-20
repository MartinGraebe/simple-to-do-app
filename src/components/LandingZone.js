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
            newToDo: 'To Do',
            currentTime: '',
            currentDate: '',
           
        }
        this.onDragStart = this.onDragStart.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.updateTasks = this.updateTasks.bind(this)
        this.saveToLocal = this.saveToLocal.bind(this)
        this.loadLocal = this.loadLocal.bind(this)
        this.resetStorage = this.resetStorage.bind(this)
        this.addTask = this.addTask.bind(this)
        this.handleChangeNew = this.handleChangeNew.bind(this)
        this.displayTime = this.displayTime.bind(this)

        this._isMounted = false // avoid memory leak with async functions
        
    }
   async componentDidMount(){
        this._isMounted = true
        this._isMounted && await this.loadLocal()
        this._isMounted && this.updateTasks()
        this.intervalID = setInterval(() => this.displayTime(), 1000)
        
    }
    componentWillUnmount(){
        this._isMounted = false
        if (this.intervalID){
            clearInterval(this.intervalID)
        }
    }
     componentDidUpdate(){
    
    }
   // Display Time
  async displayTime(){

        let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds()
        if (min < 10) {min = '0' + min}
        if (sec < 10) {sec = '0' + sec}
        let time = hour + ':' + min + ':' + sec
        
        this.setState({
            currentTime: time,
            currentDate: today
        })
        
        
   }

   
   
   
   
    // Display tasks in correct categories
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
    
     this._isMounted && this.setState({
            toDo: open,
            inProgress: working,
            done: completed
        })
    }
    // Create local storage of tasks
    saveToLocal = () => {
        const toSave = this.state.tasks
        
        localStorage.setItem('tasklist', JSON.stringify(toSave))

    }
   // Load tasks from local storage (if local storage exists)
   async loadLocal() {
        let stored
        if (localStorage.getItem('tasklist')){

            stored = JSON.parse(localStorage.getItem('tasklist'))
            this._isMounted &&   this.setState( {

                tasks: stored
            })
           
       
        }
      

        
    }
    // Delete local storage and reset all tasks to "To Do"- Category (Eventually Reset and Delete should be separated)
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
    // Add task to list 
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
        this.saveToLocal()
        this.updateTasks()
    }
    // Drag and Drop 
    onDragStart = (event, id) =>{

       
        event.dataTransfer.setData("id", id)
    }
    onDragOver = (event)  =>{
        event.preventDefault()
    }

    onDrop = (event, category) => {

        // convert data id from data transfer back into integer
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

    // Handle input into modal text field
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
                    <div>{this.state.currentTime}</div>
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