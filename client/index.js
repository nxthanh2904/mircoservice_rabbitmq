const amqp = require('amqplib/callback_api');
const express = require('express');
const app = express();
const bodyParse = require('body-parser');


const PORT = 3000;

app.use(bodyParse());
// Step1 : Create Connection
app.post('/get', (req, res) => {
    var result = [];
    amqp.connect('amqp://rabbitmq', (connError, connection) => {
        if (connError) {
            throw connError;
        }
        console.log('connected');
        //Step 2: Create  Channel
        connection.createChannel((channelError, channel) => {

            // if (channelError)
            //     throw channelError;

            // Step 3: Assert Queue
            // const QUEUE = 'codingtest'
            // channel.assertQueue(QUEUE);
            const QUEUE_IN = 'input';
            const QUEUE_OUT = 'output';
            let mess = req.body;
            console.log(req.body);
            channel.assertQueue('input');
            channel.assertQueue('output');
            // Step 4: Send message to queue

            channel.sendToQueue('input', Buffer.from(JSON.stringify(mess)));
            console.log(`Message send `, mess);
            channel.consume('output', (msg) => {
                channel.ack(msg);
                console.log(JSON.parse(msg.content));
                result = msg.content;
                res.json(JSON.parse(msg.content));
            });
        })


    })
   
})

app.listen(PORT, () => console.log(`Client is running on ${PORT}`));