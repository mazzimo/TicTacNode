var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var Game = require('./Business/Game');
var GameRepo = require('./Business/GameRepository');
var app = express();
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var joinCallback = function (roomId,repo) {
    return function () {       
        if (repo.hasGame(roomId)) {
            newGame = repo.getGame(roomId);
            if (newGame.currentStatus !== newGame.STATUS.WAIT_PLAYER_O) {
                console.log("too many users!");
                return;
            }
            console.log("player O joined game " + roomId);
            newGame.joinPlayerO();
            app.io.sockets.in(roomId).emit('O Joined');
        } else {
            console.log("game " + roomId + " created,X joined");
            newGame = new Game();
            newGame.joinPlayerX();
            app.io.sockets.in(roomId).emit('X Joined');
        }
        repo.setGame(roomId, newGame);       
    }
}

var repo = new GameRepo();

app.io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('new message', function (msg) {
        console.log('new message in room "' + msg.roomId + '"new message: ' + msg.message);
        app.io.sockets.in(msg.roomId).emit('chat message', msg.message);
    });

    socket.on('create', function (msg) {
        var newGame;
        socket.join(msg, joinCallback(msg,repo));
    });

    socket.on('send move X', function (msg) {
        
        if (repo.hasGame(msg.roomId)) {
            var currGame = repo.getGame(msg.roomId);
            var hasMoved = currGame.moveX(msg.row, msg.col);
            repo.setGame(msg.roomId, currGame);
            if (hasMoved) {
                console.log("game id: " + msg.roomId + " X moves in [" + msg.row + "," + msg.col + "]");
                app.io.sockets.in(msg.roomId).emit('X Moved', msg);
            }

            if (currGame.currentStatus === currGame.STATUS.WIN_PLAYER_X) {
                app.io.sockets.in(msg.roomId).emit('X Win', msg);
            } else if (currGame.currentStatus === currGame.STATUS.WIN_PLAYER_O) {
                app.io.sockets.in(msg.roomId).emit('O Win', msg);
            } else if (currGame.currentStatus === currGame.STATUS.DRAW) {
                app.io.sockets.in(msg.roomId).emit('Draw', msg);
            };


        } else {
            console.log("game " + msg.roomId + "not found");
            return;
        }
    });

    socket.on('send move O', function (msg) {      
        if (repo.hasGame(msg.roomId)) {
            var currGame = repo.getGame(msg.roomId);
            var hasMoved = currGame.moveO(msg.row, msg.col);
            repo.setGame(msg.roomId, currGame);
            if (hasMoved) {
                console.log("game id: " + msg.roomId + " O moves in [" + msg.row + "," + msg.col + "]");
                app.io.sockets.in(msg.roomId).emit('O Moved', msg);
            }

            if (currGame.currentStatus === currGame.STATUS.WIN_PLAYER_X) {
                app.io.sockets.in(msg.roomId).emit('X Win', msg);
            } else if (currGame.currentStatus === currGame.STATUS.WIN_PLAYER_O) {
                app.io.sockets.in(msg.roomId).emit('O Win', msg);
            } else if (currGame.currentStatus === currGame.STATUS.DRAW) {
                app.io.sockets.in(msg.roomId).emit('Draw', msg);
            };

        } else {
            console.log("game " + msg.roomId + "not found");
            return;
        }
    });

});

module.exports = app;
