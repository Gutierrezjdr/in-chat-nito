var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db= require("./db.js"); 
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var coursesRouter = require('./routes/courses');
var logoutRouter = require('./routes/logout');
var cookiesRouter = require('./routes/cookies');



const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server); 
const PORT = process.env.PORT|| 3001;

const UsersService = require('./UsersService')
const userService = new UsersService(); 

//DATABASE

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


server.listen(PORT, function(){
  console.log('listening on *:3001');
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client','build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/login',loginRouter);
app.use('/courses',coursesRouter);
app.use('/logout',logoutRouter);
app.use('/cookies',cookiesRouter);

app.get('/*',function(req, res, next) {
	res.sendFile(path.join(__dirname,'client','build','index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
    });
  //res.send('error');
  console.log(err);
});



//using sendFile to link to our index.html instead of having strings in this file (i.e Hello World)
/*app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/client/public/index.html');
  }); */



io.on('connection', socket => {
  socket.on('join', (name) => {
    const temp =new UsersService();
    //temp.room=socket.room;
    //console.log(temp.room);
     // userService['room']=temp ;
      //userService[socket.room]= new UsersService();
      userService.addUser({
          id: socket.id,
          name
      });
       
     
       //console.log("Name: "+ name+" Room: " +socket.room);

      io.emit('update', {
          users: userService.getAllUsers()
      });
  });

  socket.on('disconnect', () => {
      userService.removeUser(socket.id);
      io.to(socket.room).emit('update', {
          users: userService.getAllUsers()
      });
  });

  socket.on('message', message => {
    
    var time=Math.round(new Date().getTime()/1000);
    console.log(time);
    
      const {name} = userService.getUserById(socket.id);
        console.log("Added message to this room" + room);
            //Inputs message into db. 
      let input = [ room,message.text,name,time  ];
      db.query( 'INSERT INTO chat_table(chatRoom,message,userName,msgTime) VALUES (?,?,?,?)',input,function(err,rows){
        if(err){
          console.log("Could not input into db.  "+ err);
        } else{
          console.log(JSON.stringify(rows));
          console.log("Message in DB");
        }
        
      }); 

      //Broadcasts message to room
      console.log("The room this will broadcast in " + room);
      socket.to(room).broadcast.emit('message', {
          text: message.text,
          from: name
      });

     console.log('room :'+ room + ' got message', message);
  });


  socket.on('getUsers', () => {
      io.emit('update', {
          users: userService.getAllUsers()
      });
  });


  var room; // capture the room in our closure
  socket.on('join room', (num) => {
    console.log(num);
    room = `room${num}`;
    socket.join(room);

    //Looks for previous messages
    db.query("SELECT * FROM chat_table WHERE chatRoom = ? ORDER BY msgTime ASC LIMIT 20 ",room, function(err,rows){
      if(err){
        console.log("error: ",err);
      } else{
        console.log("Inside JOIN ROOM")
        //console.log( rows);
        
       // table = rows;
       for(var row in rows)
        {
        //  console.log("INSIDE JOIN ROOM THis is row : " + rows[row].message);
          socket.emit('message', {
            text: rows[row].message,
            from: rows[row].userName
          });

        } 
   }
    });

  });

});


module.exports = app;