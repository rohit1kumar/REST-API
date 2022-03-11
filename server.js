require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const multer = require("multer");
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const databaseName = 'eventDB'
const app = express()
const client = new MongoClient(process.env.URL)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

async function dbConnect() {
    let result = await client.connect()
    console.log("connected succesfully to DB")
    db = result.db(databaseName)
    return db.collection('events')
}
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '/images')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname)
        }
    })
}).single('image');


app.get('/api/v3/app/events', async (req, res) => {
    let data = await dbConnect()
    let findResult = await data.find({ _id: ObjectId(req.query.id) }).toArray()
    res.send(findResult)
})


app.post('/api/v3/app/events', async (req, res) => {
    let data = await dbConnect()
    let insertResult = await data.insertOne({
        name: req.body.name,
        tagline: req.body.tagline,
        schedule: Date(req.body.schedule),
        description: req.body.description,
        moderator: req.body.moderator,
        category: req.body.category,
        sub_category: req.body.sub_category,
        rigor_rank: parseInt(req.body.rigor_rank)
    })
    res.send("inserted succesfully")


})
app.delete('/api/v3/app/events/:id', async (req, res) => {
    let data = await dbConnect()
    let deleteResult = await data.deleteOne({ _id: ObjectId(req.params.id) })
    res.send("deleted successfully")

})

app.put('/api/v3/app/events/:id', async (req, res) => {
    let data = await dbConnect()
    let updateResult = await data.updateOne({ _id: ObjectId(req.params.id) }, {
        $set: {
            name: req.body.name,
            tagline: req.body.tagline,
            schedule: Date(req.body.schedule),
            description: req.body.description,
            moderator: req.body.moderator,
            category: req.body.category,
            sub_category: req.body.sub_category,
            rigor_rank: parseInt(req.body.rigor_rank)
        }
    })
    res.send("updated successfully")
})

app.listen(process.env.PORT || 3000, () => console.log("Server started on port ${port}"))