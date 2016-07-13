function GameRepository() {
    
    var allGames = new Array();
    
    this.hasGame = function (id) {
        return allGames[id] !== undefined;
    }

    this.getGame = function (id) {
        return allGames[id];
    };

    this.setGame = function (id, game) {
        allGames[id] = game;
    };
}

module.exports = GameRepository;