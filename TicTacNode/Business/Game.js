function TicTacToeGame() {

    this.STATUS = {
        CREATED : 'created',
        WAIT_PLAYER_O : 'wait player O',
        TURN_PLAYER_X : 'turn player X',
        TURN_PLAYER_O : 'turn player O',
        WIN_PLAYER_X : 'win player X',
        WIN_PLAYER_O : 'win player O',
        DRAW : 'draw'
    };       

    this.getValueFromCell = function (row, col) {
        
        if (row < 0 || row > 2 || col < 0 || col > 2)
            return;
        
        return this.board[(row * 3) + col];

    };    
    this.setValueToCell = function (row, col, val) {
        
        if (row < 0 || row > 2 || col < 0 || col > 2)
            return;
        
        this.board[(row * 3) + col] = val;

    };
    
    var checkIfCoordinatesAreInDiagional = function (row, col) {
        
        if (row === col && col === 1) {
            return 2;
        }

        if (row === col) {
            return 0;
        }

        if ((row + col) === 2) {
            return 1;
        }

        return -1;
    }

    var moveFunc = function (game, 
                             statusTurn, 
                             statusTurnNext, 
                             statusWin, 
                             symbolToSet, 
                             numberOfSymbolsInRow, 
                             numberOfSymbolsInColumn, 
                             numberOfSymbolsInDiagonals, 
                             row, col) {

        if (game.currentStatus !== statusTurn) {
            return false;
        }
        
        if (game.getValueFromCell(row, col) !== '') {
            return false;
        }
        
        game.setValueToCell(row, col, symbolToSet);
        
        if (numberOfSymbolsInRow[row] === 2 || numberOfSymbolsInColumn[col] === 2) {
            game.currentStatus = statusWin;
            return true;
        }
        
        var diagonalIdx = checkIfCoordinatesAreInDiagional(row, col);
        
        if (diagonalIdx === 2) {

            if (numberOfSymbolsInDiagonals[0] === 2 || numberOfSymbolsInDiagonals[1] === 2) {
                game.currentStatus = statusWin;
                return true;
            }
            numberOfSymbolsInDiagonals[0]++;
            numberOfSymbolsInDiagonals[1]++;
        } else if (diagonalIdx > -1) {
            
            if (numberOfSymbolsInDiagonals[diagonalIdx] === 2) {
                game.currentStatus = statusWin;
                return true;
            }
            numberOfSymbolsInDiagonals[diagonalIdx]++;
        }
        
        numberOfSymbolsInRow[row]++;
        numberOfSymbolsInColumn[col]++;
        game.totalMoves++;
        game.currentStatus = statusTurnNext;

        if (game.totalMoves === 9) {
            game.currentStatus = game.STATUS.DRAW;
        }

        return true;
    };
    
    this.moveX = function (row, col) {
        return moveFunc(this, 
                 this.STATUS.TURN_PLAYER_X, 
                 this.STATUS.TURN_PLAYER_O, 
                 this.STATUS.WIN_PLAYER_X, 
                 'X', 
                 this.numberOfXsInRows, 
                 this.numberOfXsInColumns, 
                 this.numberOfXsInDiagonals, 
                 row, col);
    };
    
    this.moveO = function (row, col) {
        return moveFunc(this, 
                 this.STATUS.TURN_PLAYER_O, 
                 this.STATUS.TURN_PLAYER_X, 
                 this.STATUS.WIN_PLAYER_O, 
                 'O', 
                 this.numberOfOsInRows, 
                 this.numberOfOsInColumns, 
                 this.numberOfOsInDiagonals, 
                 row, col);
    };
    
    this.joinPlayerX = function () {
        if (this.currentStatus === this.STATUS.CREATED) {
            this.currentStatus = this.STATUS.WAIT_PLAYER_O;
        }
    };
    
    this.joinPlayerO = function () {
        if (this.currentStatus === this.STATUS.WAIT_PLAYER_O) {
            this.currentStatus = this.STATUS.TURN_PLAYER_X;
        }
    };

    this.board = ['', '', '', '', '', '', '', '', ''];

    this.numberOfXsInRows = [0, 0, 0];
    this.numberOfXsInColumns = [0, 0, 0];
    this.numberOfXsInDiagonals = [0, 0];
    
    this.numberOfOsInRows = [0, 0, 0];
    this.numberOfOsInColumns = [0, 0, 0];
    this.numberOfOsInDiagonals = [0, 0];

    this.currentStatus = this.STATUS.CREATED;
    this.totalMoves = 0;  
};

module.exports = TicTacToeGame;

