var MainController = function ($scope,ChatFactory) {

    var socket = io();
    var that = this;
    this.Board = new Array(9);
    this.isYourTurn = false;
    this.youWon = false;
    this.youLose = false;
    this.youDraw = false;
    this.message = "";
    this.SetChatId = function (chatid) {
        socket.emit('create', chatid);
        that.chatid = chatid;
    };
    
    
    this.getCellClass = function (index) {
        return that.Board[index];
    }
       
    this.SendMessage = function () {
        if (this.Symbol) {
            var message = that.MessageToSend.split(',');
            socket.emit("send move " + that.Symbol, { roomId : that.chatid, row : message[0], col : message[1] });
        }
    };
    
    this.SendMove = function (row, col) {
        if (that.isYourTurn) {
            socket.emit("send move " + that.Symbol, { roomId : that.chatid, row : row, col : col });
        }
    }

    socket.on('O Joined', function (msg) {
        console.log("O joined");
        if (!that.Symbol) {
            that.Symbol = 'O';
            that.message = "wait for player X to move";
            that.isYourTurn = false;
        } else {
            that.message = "your turn to move!";
            that.isYourTurn = true;
        }
        $scope.$apply();
    });

    socket.on('X Joined', function (msg) {
        console.log("X joined");
        that.message = "wait for player O";
        that.Symbol = 'X';
        $scope.$apply();
    });

    socket.on('X Moved', function (msg) {
        that.Board[((parseInt(msg.row)) * 3) + (parseInt(msg.col))] = 'x';
        if (that.Symbol === 'X') {
            that.message = "wait for player O to move";
            that.isYourTurn = false;
        } else {
            that.message = "your turn to move!";
            that.isYourTurn = true;
        }
        $scope.$apply();
    });

    socket.on('O Moved', function (msg) {
        that.Board[((parseInt(msg.row)) * 3) + (parseInt(msg.col))] = 'o';
        if (that.Symbol === 'O') {
            that.message = "wait for player X to move";
            that.isYourTurn = false;
        } else {
            that.message = "your turn to move!";
            that.isYourTurn = true;
        }
        $scope.$apply();
    });

    socket.on('X Win', function (msg) {
        if (that.Symbol === 'X') { 
            that.youWon = true;
        } else {
            that.youLose = true;
        }
        that.message = "game finished";
        that.isYourTurn = false;
        $scope.$apply();
    });

    socket.on('O Win', function (msg) {
        if (that.Symbol === 'O') {
            that.youWon = true;
        } else {
            that.youLose = true;
        }
        that.message = "game finished";
        that.isYourTurn = false;
        $scope.$apply();
    });

    socket.on('Draw', function (msg) {
        that.message = "game finished";
        that.youDraw = true;
        that.isYourTurn = false;
        $scope.$apply();
    });

}

MainController.$inject = ['$scope','ChatFactory'];