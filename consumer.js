const amqp = require('amqplib/callback_api');
const mess = {
    // code: 1,
    // data: 'trẻ hơn tuổi'
    code: 2,
    data: "Vietnamnet"

}

// Step1 : Create Connection
amqp.connect('amqp://localhost', (connError, connection) => {
    if (connError) {
        throw connError;
    }
    //Step 2: Create  Channel
    connection.createChannel((channelError, channel) => {
        
        if (channelError)
            throw channelError;

        // Step 3: Assert Queue
        // const QUEUE = 'codingtest'
        // channel.assertQueue(QUEUE);
        const QUEUE_IN = 'input';
        const QUEUE_OUT = 'output';

        channel.assertQueue(QUEUE_IN);
        channel.assertQueue(QUEUE_OUT);
        // Step 4: Send message to queue

        channel.sendToQueue(QUEUE_IN, Buffer.from(JSON.stringify(mess)));
        console.log(`Message send `, mess);
        channel.consume(QUEUE_OUT, (msg) => {
        channel.ack(msg);
            console.log(JSON.parse(msg.content));
        });

        // channel.purgeQueue(QUEUE_IN, () =>{
        //     console.log('Clear queue_in');
        // });
        // channel.purgeQueue(QUEUE_OUT, ()=>{
        //     console.log('Clear queue out');
        // })

    })


})
