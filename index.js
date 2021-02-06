//programmed by Mikhail Toropchinov 2020

const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
var cors = require('cors')

const app = express()
app.use(cors())

app.use(express.json({extended: true}))
app.options('*', cors());

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/userupdate', require('./routes/update.routes.js'))
app.use('/api/posts', require('./routes/post.routes.js'))
app.use('/api/enterprise', require('./routes/enterprise.routes.js'))

const PORT = config.get('port') || 8080

async function start() {
    try{
    await mongoose.connect(config.get('mongoUri'),{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
        })
    app.listen(PORT, () => console.log('App has been started on port' ,PORT))
    }

    catch(e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}
start()


