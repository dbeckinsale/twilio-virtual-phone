const express = require('express')
const app = express();
const cors = require('cors');
const path = require("path")

const api = require('./routes/api');
const webhooks = require('./routes/webhook');
const twilio = require('twilio');

const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));

// établissement de la connexion
io.on('connection', (socket) => {
});

app.post('/api/v1/message', api.sendMessage);
app.get('/api/v1/message/phone/:id/conversation', api.getConversationListByPhone);
app.get('/api/v1/message/phone/:id/conversation/:number', api.getConversationMessageList);

app.get('/api/v1/phone', api.getPhone);

app.use('/webhook/', twilio.webhook({ protocol: 'https' }));
app.post('/webhook/v1/message', webhooks.createMessage, (req, res) => {
  io.sockets.emit('refreshMessage');
  res.status(201).send(`Message added !`);
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.redirect('/');
});

server.listen(PORT);