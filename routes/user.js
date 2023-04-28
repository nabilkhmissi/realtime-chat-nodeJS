const router = require('express').Router();
const userCtrl = require('../controllers/user');

router.get('/friends/:id', userCtrl.getFriends);
router.get('', userCtrl.getUsers);
router.get('/search', userCtrl.searchUsers);
router.post('/addFriend', userCtrl.addToFriends);
router.post('/removeFriend', userCtrl.removeFriend);
router.get('/:id', userCtrl.findById);

module.exports = router;