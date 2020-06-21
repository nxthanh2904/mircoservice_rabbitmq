const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const Articles = require('./model/artical');
const app = express();
require('dotenv/config');

const PORT = 8000;

//connect db
const db = process.env.DATABASE;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected succesfully"))
    .catch(err => console.log(err));

// // Communication by QUEUE
const profile1 = {
    name: "tony",
    age: 18
};
const profile2 = {
    name: "tool",
    age: 20
};
amqp.connect('amqp://localhost', (connError, connection) => {
    if (connError) {
        throw connError;
    }
    connection.createChannel((channelError, channel) => {
        if (channelError)
            throw channelError;

        const QUEUE_IN = 'input';
        const QUEUE_OUT = 'output';
        channel.assertQueue(QUEUE_IN);
        channel.assertQueue(QUEUE_OUT);
        // step 4: reiceve messages
        channel.consume(QUEUE_IN, async (msg) => {
            channel.ack(msg);
            console.log(`Message receive: ${msg.content}`)
            const mess = JSON.parse(msg.content);
            if (mess.code == 1) {
                const res = await getByTag(mess.data);
                console.log("===============================");
                console.log(res);
                channel.sendToQueue(QUEUE_OUT, Buffer.from(JSON.stringify(res)));
                // channel.purgeQueue(QUEUE_IN, () =>{
                //     console.log('Clear queue_in');
                // });


            }
            else if (mess.code == 2) {
                const res = await getByWeb(mess.data);
                console.log("===============================");
                console.log(res);
                channel.sendToQueue(QUEUE_OUT, Buffer.from(JSON.stringify(res)));

            }
            //  channel.ack(msg);
        })

    })

})
async function getByTag(data) {
    // console.log(data);
    // const { tag } = data;
    const articles = await Articles.find({ tags: data }).limit(1);
    console.log(articles);
    return articles;
}

async function getByWeb(web) {

    // const { web } = data;
    const articles = Articles.find({ "website.name": web }).limit(1);
    return articles;
}


app.listen(PORT, ()=>console.log(`Server is running on ${PORT}`));