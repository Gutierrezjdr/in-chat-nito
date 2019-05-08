import React from 'react';
import './App.css';
import './SignUp.css'
import HomePage from "./components/HomePage"
import ClassList from "./components/ClassList"
import Logout from "./components/Logout"
import ChatNav from "./components/ChatNav"
import MessageForm from "./components/MessageForm.jsx";
import MessageList from "./components/MessageList.jsx";
import UsersList from "./components/UsersList.jsx";
// import React, { Component } from 'react';


import io from "socket.io-client";
const socket = io('/')


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      activeChat: false,
      page:'',
      users: [],
      courses: [],
      messages: [],
      text: '',
      room: ''

    }; 
    this.onDisconnectStatus = '';
  }

  componentWillMount()
  {
   /* fetch('/cookies', {
      method:'GET'
      })
      .then(res => res.json())
      .then(res => {
        console.log("Got cookies page " + res.page);
       // var page =res.page;
        this.setState({
          page:res.page,
          name: res.getUsername
        });
      }) */

  }
  componentDidMount(){
    socket.on('message', message => this.messageReceive(message));
    socket.on('update', ({users}) => this.chatUpdate(users));

    fetch('/cookies', {
      method:'GET'
      })
      .then(res => res.json())
      .then(res => {
        console.log("Got cookies page " + res.page);
       // var page =res.page;
        this.setState({
          page: res.page,
          name: res.getUsername
        });

       
      })
      
  }

  messageReceive(message) {
    const messages = [...this.state.messages, message];
    this.setState({messages})
  }

  chatUpdate(users) {
    this.setState({users});
  }

  handleUserSubmit(name) {
    if(name) {
        this.setState({name});
        socket.emit('join', name);
    }
    //SETS PAGE TO COURSES
    fetch(`/cookies/courses`,{
      method: 'POST',
      header: 'courses'
    }).then(res =>  console.log("Courses set as page"))
}

  handleMessageSubmit(message) {
    if (message.text) {
        const messages = [...this.state.messages, message];
        this.setState({messages});
        socket.emit('message', message);
    }
  }

  handleRoomClick = (classID) => {
    // join a room
    const room = classID;
    socket.emit('join room', room);
  
    this.setState({ room });
    console.log(this.state.messages);
    console.log("room " + room + " was clicked");

    //WILL GO TO CHAT
    this.setState(
      {
        page:'chat'
      }
    )
      
    
    fetch(`/cookies/chat`,{
      method: 'POST',
      header: 'chat'
    }).then(res =>  console.log("Chat set as page."))

   // console.log("Loading messages...."); 
}



  // --- LOGIN FUNCTION ---
  getUsername = async(event) => {
    //this prevents the page from reloading when the button is clicked
    event.preventDefault();

    // gets userinput from login field and prints name in console
    const existing_username = event.target.elements.name.value;
    console.log(existing_username);

    fetch(`/login/${existing_username}`, {
      method:'POST',
      header: existing_username
    })
    .then(res => {
      console.log(res.status)
      // if user does not exists, print error message on screen
      if(res.status === 404){
        //this.setState({ name : existing_username })
          let error = "No user found.";
          // gets element with id 'login_error" and prints the error on the screen
          document.getElementById('login_error').innerHTML = error;
        };

      // if user exists, store username in state + fetch courses -> redirects to courses page
      if(res.status === 200){
        // setting the state causes the page to be rerendered
        this.setState({ name : existing_username })
        this.handleUserSubmit(existing_username);

        // fetch list of courses from backend route
        fetch('/courses',{
          method:'POST'
        })
        .then(res => res.json())
        .then(courses => this.setState({ courses }))
        .then(test => console.log(this.state.courses))
      }
    })
  }


// --- SIGN UP FUNCTION ---
createUsername = async(u) => {
  //this prevents the page from reloading when the button is clicked
  u.preventDefault();

  // gets userinput from signup field and prints name in console
  const new_username = u.target.elements.new_username.value;
  console.log(new_username);

  // checks if the new username already exists
  fetch(`/signup/${new_username}`, {
    method:'GET',
    header: new_username
  })
  .then(res=>{
    console.log(res.status)

    if(res.status === 404){
      let message = "Username already exists.";
      // if user exists -> print error message
        // gets element with id 'signup_error" and prints the error message on the screen
        document.getElementById('signup_error').innerHTML = message;

    }

    if(res.status === 200){
      let message = "User has been created";

      // fetch list of courses from backend route
      fetch('/courses',{
        method: 'POST'
      })
      .then(res => res.json())
      .then(courses => this.setState({ courses }))
      .then(test => console.log(this.state.courses))

         // creates username, store new_username in state + fetch courses -> redirects to courses page
        this.setState({ name : new_username })
        this.handleUserSubmit(new_username);


      }
    })

    //SETS PAGE TO COURSES
    fetch(`/cookies/courses`,{
      method: 'POST',
      header: 'courses'
    }).then(res =>  console.log(res))

  }

logOut = (e) => {
  e.preventDefault();
  fetch(`/logout`,{
    method: 'POST'
  }).then(res => {
    this.setState({
      name: undefined,
      activeChat: false
    })
  })
  .then(stuff => {
    socket.on('disconnect', () => {
      this.setState({
          users: [],
          activeChat : false,
          courses : [],
          messages: [],
          text: '',
          name: undefined
      });
    })
  })

  //sets page info
  fetch(`/cookies/login`,{
    method: 'POST',
    header: 'courses'
  }).then(res =>  console.log("Login set as page"))

}

backToCourses = (e) => {
    this.setState({
        page: 'courses',
        activeChat : false,
        messages:[]
    });
  
  //SETS PAGE TO COURSES
    fetch(`/cookies/courses`,{
      method: 'POST',
      header: 'courses'
    }).then(res =>  console.log("Courses set as page"))

}

switchToChat = (w) => {
  //w.preventDefault();
  //console.log(JSON.stringify(course));
  this.setState({
    activeChat : true,
    
  })
 
  //socket.emit('join',course.courseID , this.state.name);
 //this.handleUserSubmit(this.set.name);
  //console.log(this.state.name);
  
 // console.log(courseID);
}

// -- --- RENDERING ---

// let result = condition ? value1 : value2;
// render() {
//   return this.state.name === undefined ? this.renderHomePage() : this.renderChat();
// }


renderHomePage(){
  return(
    <div className="wrapper">
      <HomePage getUsername={this.getUsername} createUsername={this.createUsername}/>
    </div>
  )
}

renderChat() {
  return (
    <div className="wrapper" >
      <div className="container">
        <div className="row">
          <div className="title">
          <h4>Chat Page </h4>
           <h2>Room {this.state.room}</h2>
           </div>

          <div className="col-xs-5 image-container">
          <ChatNav logOut={this.logOut} backToCourses={this.backToCourses}/>
          </div>

          <div className="col-xs-7 form-container-nav">
            
            {/* <Logout logOut={this.logOut}/> */}
            
            {/* <UsersList
              users={this.state.users}
              name = {this.state.name}
              /> */}

          <div className = "MessageWrapper">
            <MessageList
                messages={this.state.messages}
                name = {this.state.name}
                last = {this.state.messages[this.state.messages.length-2]}
                
            />
            <MessageForm
                onMessageSubmit={message => this.handleMessageSubmit(message)}
                name={this.state.name}
            />
          </div>
          
          </div>
          </div>
      </div>
    </div>
  );
}

renderCoursePage() {
  return (
    
    <div className = "wrapper"> 
       <Logout logOut={this.logOut}/>
      <ClassList switchToChat={this.switchToChat} courses={this.state.courses} handleRoomClick={this.handleRoomClick} />
    </div>
   
  );
}

render(){
  if(this.state.name === undefined && this.state.activeChat === false)//this.state.page!== 'chat')//this.state.activeChat === false||this.state.page==='login')
    return this.renderHomePage()
  else if(this.state.name !== undefined && this.state.activeChat === false)//this.state.page==='courses')//this.state.activeChat === false||this.state.page ==='courses')
    return this.renderCoursePage()
  else 
    return this.renderChat()
}

}

export default App;
