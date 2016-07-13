///<reference path="../Business/Game.js" />

describe("Game", function () {
    
    it("should have status created at the beginning", function () {
        var game = new TicTacToeGame();
        expect(game.currentStatus).toEqual(game.STATUS.CREATED);
    });

    it("should move to status 'WAIT PLAYER O' if player X joins", function () {
        var game = new TicTacToeGame();
        game.joinPlayerX();        
        expect(game.currentStatus).toEqual(game.STATUS.WAIT_PLAYER_O);
    });

    it("should move to status 'TURN PLAYER X' if player O joins", function () {
        var game = new TicTacToeGame();
        game.joinPlayerX();
        game.joinPlayerO();
        expect(game.currentStatus).toEqual(game.STATUS.TURN_PLAYER_X);
    });
    
    it("player X should move and the value of the cell should be equal to X and should be turn to O", function () {
        var game = new TicTacToeGame();
        game.joinPlayerX();
        game.joinPlayerO();
        var hasMoved = game.moveX(0, 1);
        expect(game.currentStatus).toEqual(game.STATUS.TURN_PLAYER_O);
        expect(game.totalMoves).toEqual(1);
        expect(game.getValueFromCell(0, 1)).toEqual('X');
        expect(hasMoved).toEqual(true);
    });

    it("player X shouldn't be able to move again", function () {
        var game = new TicTacToeGame();
        game.joinPlayerX();
        game.joinPlayerO();
        var hasMoved = game.moveX(0, 1);
        var hasMovedAgain = game.moveX(1, 1);
        expect(game.currentStatus).toEqual(game.STATUS.TURN_PLAYER_O);
        expect(game.totalMoves).toEqual(1);
        expect(game.getValueFromCell(1, 1)).not.toEqual('X');
        expect(hasMoved).toEqual(true);
        expect(hasMovedAgain).toEqual(false);
    });

    it("player O shouldn't be able to move in a spot occupied before", function () {
        var game = new TicTacToeGame();
        game.joinPlayerX();
        game.joinPlayerO();
        var hasXmoved = game.moveX(0, 1);
        var hasOmoved = game.moveO(0, 1);
        expect(game.currentStatus).toEqual(game.STATUS.TURN_PLAYER_O);
        expect(game.totalMoves).toEqual(1);
        expect(game.getValueFromCell(0, 1)).not.toEqual('O');
        expect(hasXmoved).toEqual(true);
        expect(hasOmoved).toEqual(false);
    });

    it("player O should be able to move in a free spot", function () {
        var game = new TicTacToeGame();
        game.joinPlayerX();
        game.joinPlayerO();
        var hasXmoved = game.moveX(0, 1);
        var hasOmoved = game.moveO(1, 1);
        expect(game.currentStatus).toEqual(game.STATUS.TURN_PLAYER_X);
        expect(game.totalMoves).toEqual(2);
        expect(game.getValueFromCell(1, 1)).toEqual('O');
        expect(hasXmoved).toEqual(true);
        expect(hasOmoved).toEqual(true);
    });

    it("should as make X winner if makes 3 X in a row", function () {
        var game = new TicTacToeGame();
        game.joinPlayerX();
        game.joinPlayerO();
        game.moveX(0, 1);
        game.moveO(1, 1);
        game.moveX(0, 0);
        game.moveO(1, 0);
        game.moveX(0, 2);
        expect(game.currentStatus).toEqual(game.STATUS.WIN_PLAYER_X);
    });

    it("should as make X winner if makes 3 X in a column", function () {
        var game2 = new TicTacToeGame();
        game2.joinPlayerX();
        game2.joinPlayerO();
        game2.moveX(0, 0);
        game2.moveO(1, 1);
        game2.moveX(1, 0);
        game2.moveO(1, 2);
        game2.moveX(2, 0);
        expect(game2.currentStatus).toEqual(game2.STATUS.WIN_PLAYER_X);
    });

    it("should as make X winner if makes 3 X in a diagonal", function () {
        var game3 = new TicTacToeGame();
        game3.joinPlayerX();
        game3.joinPlayerO();
        game3.moveX(0, 0);
        game3.moveO(1, 0);
        game3.moveX(1, 1);
        game3.moveO(2, 0);
        game3.moveX(2, 2);
        expect(game3.currentStatus).toEqual(game3.STATUS.WIN_PLAYER_X);    
    });

    it("should as make O winner if makes 3 O in a row", function () {
        var game4 = new TicTacToeGame();
        game4.joinPlayerX();
        game4.joinPlayerO();
        game4.moveX(0, 0);
        game4.moveO(1, 0);
        game4.moveX(2, 1);
        game4.moveO(1, 1);
        game4.moveX(2, 0);
        game4.moveO(1, 2);  
        expect(game4.currentStatus).toEqual(game4.STATUS.WIN_PLAYER_O);     
    });
    
    it("should as make O winner if makes 3 O in a column", function () {
        var game5 = new TicTacToeGame();
        game5.joinPlayerX();
        game5.joinPlayerO();
        game5.moveX(0, 0);
        game5.moveO(0, 1);
        game5.moveX(1, 2);
        game5.moveO(1, 1);
        game5.moveX(2, 0);
        game5.moveO(2, 1);
        expect(game5.currentStatus).toEqual(game5.STATUS.WIN_PLAYER_O);      
    });
    
    it("should as make O winner if makes 3 O in a diagonal", function () {
        var game6 = new TicTacToeGame();
        game6.joinPlayerX();
        game6.joinPlayerO();
        game6.moveX(0, 0);
        game6.moveO(2, 0);
        game6.moveX(1, 2);
        game6.moveO(1, 1);
        game6.moveX(2, 1);
        game6.moveO(0, 2);
        expect(game6.currentStatus).toEqual(game6.STATUS.WIN_PLAYER_O);     
    });

    it("should as make draw if all squares are covered and no winner arises", function () {
        var game7 = new TicTacToeGame();
        game7.joinPlayerX();
        game7.joinPlayerO();
        game7.moveX(1, 1);
        game7.moveO(0, 0);
        game7.moveX(1, 0);
        game7.moveO(1, 2);
        game7.moveX(0, 1);
        game7.moveO(2, 1);
        game7.moveX(2, 0);
        game7.moveO(0, 2);
        game7.moveX(2, 2);
        expect(game7.currentStatus).toEqual(game7.STATUS.DRAW);      
    });

});