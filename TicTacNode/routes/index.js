var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:chatid', function (req, res) {
    var finalChatId = req.params.chatid;
    var isNew = req.params.isNew
    res.render('index', { title: 'Tic Tac Node', chatid : finalChatId });
});


router.get('/', function (req, res) { 
    var newChatId = Math.floor(Math.random() * 125) + 1;
    res.redirect('/' + newChatId);
});

module.exports = router;