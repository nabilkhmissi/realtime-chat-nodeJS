const User = require('../db/user');
require('../connectDB')

exports.login = async (req, res) => {
    console.log(req.body)
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(500).send({ message: 'invalid username/password !' });

    }
    if (req.body.password === user.password) {
        return res.status(200).send({ username: user.username, name: user.name, _id: user._id });
    }
    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });

}

exports.signup = async (req, res) => {
    try {
        let { username, name, password } = req.body;
        if (!name || !username || !password) {
            console.log('champs are required')
            res.status(500).send({ message: 'please fill all fields' });
            return;
        }
        console.log('after first check')
        let user = await User.findOne({ username: username });
        if (user) {
            res.status(500).send({ message: 'username already exist ! try with another username' });
            return;
        }
        if (username && password) {
            const newUser = await new User({
                username: username,
                password: password,
                name: name
            }).save();
            res.status(201).send({ message: 'user created successfully!' });
        } else {
            res.status(500).send({ message: 'error happened' });
        }
    } catch (error) {
        res.status(500).send(error);
    }


}

exports.getFriends = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.id }).populate('friends');
        let friends = user.friends;
        res.status(200).send(user.friends)
    } catch (error) {
        res.status(500).send(error)
    }

}


exports.getUsers = async (req, res) => {
    let users = await User.find({});
    res.status(200).send(users)
}

exports.searchUsers = async (req, res) => {
    try {
        let users = await User.find({ name: { $regex: req.query.name, $options: 'i' } });
        res.status(200).send(users)

    } catch (error) {
        res.status(500).send(error)
    }
}
exports.findById = async (req, res) => {
    try {
        let id = req.params.id
        let users = await User.findOne({ _id: id });
        res.status(200).send(users)

    } catch (error) {
        res.status(500).send(error)
    }
}
exports.addToFriends = async (req, res) => {
    try {
        let { authUser, selectedUser } = req.body;

        let activeUser = await User.findOne({ _id: authUser._id });
        let targetUser = await User.findOne({ _id: selectedUser._id });

        if (!activeUser.friends.includes(targetUser._id)) {
            activeUser.friends.push(targetUser._id);
            activeUser.save();
        }
        if (!targetUser.friends.includes(activeUser._id)) {
            targetUser.friends.push(activeUser);
            targetUser.save();
        }
        res.status(200).send({ message: 'friend added successfully !' })
    } catch (error) {
        res.status(500).send(error)
    }
}
exports.removeFriend = async (req, res) => {
    try {
        let { currentUser, targetUser } = req.body;
        let activeUser = await User.findOne({ _id: currentUser._id });
        let otherUser = await User.findOne({ _id: targetUser._id });
        if (!activeUser.friends.includes(targetUser._id)) {
            activeUser.friends = activeUser.friends.filter(user => user._id !== targetUser._id);
            activeUser.save();
        }
        if (!otherUser.friends.includes(currentUser._id)) {
            otherUser.friends = otherUser.friends.filter(user => user._id !== currentUser._id);
            otherUser.save();
        }
        res.status(200).send({ message: 'friend deleted successfully !' })
    } catch (error) {
        res.status(500).send(error)
    }
}

