require('dotenv').config({ path: '.env' });

    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const Chatkit = require('@pusher/chatkit-server');

    const app = express();

    const chatkit = new Chatkit.default({
      instanceLocator: 'v1:us1:023f443a-5cbe-451c-b36f-00036dcb91f1' ,
      key: '2dd30f3e-ae0e-4f2d-9748-68e9baa123a7:H4lRgeH669lOyRdRL/7rH4aWICNEGYNtVUJC41dad9E=',
    });

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cors({
        origin: 'http://localhost:4200'
      }));

    app.post('/users', (req, res) => {
      const { userId } = req.body;

      chatkit
        .createUser({
          id: userId,
          name: userId,
        })
        .then(() => {
          res.sendStatus(201);
        })
        .catch(err => {
          if (err.error === 'services/chatkit/user_already_exists') {
            console.log(`User already exists: ${userId}`);
            res.sendStatus(200);
          } else {
            res.status(err.status).json(err);
          }
        });
    });

    app.post('/authenticate', (req, res) => {
      const authData = chatkit.authenticate({
        userId: req.query.user_id,
      });
      res.status(authData.status).send(authData.body);
    });

    app.set('port', process.env.PORT || 5200);
    const server = app.listen(app.get('port'), () => {
      console.log(`Express running → PORT ${server.address().port}`);
    });