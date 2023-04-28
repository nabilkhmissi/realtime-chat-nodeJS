const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://system:system@cluster0.8dld4l3.mongodb.net/talkywalky?retryWrites=true&w=majority')
    .then(() => { console.log('mongoDB connected...') })
    .catch((error) => {
        console.log('error happened with DB :' + error)
    })