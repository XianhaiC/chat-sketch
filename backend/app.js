'use strict'
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const compression = require('compression')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()
const uuidv4 = require('uuid/v4')
const router = express.Router()
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'})
const sketchesTable = 'Sketches'

app.set('view engine', 'pug')

if (process.env.NODE_ENV === 'test') {
  // NOTE: aws-serverless-express uses this app for its integration tests
  // and only applies compression to the /sam endpoint during testing.
  router.use('/sam', compression())
} else {
  router.use(compression())
}

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())

// NOTE: tests can't find the views directory without this
app.set('views', path.join(__dirname, 'views'))

const fetch = require("node-fetch")
const serverTokenDurationSec = 30
const ext = {
    secret: process.env.EXT_SECRET,
    clientId: process.env.EXT_CLIENT_ID,
    ownerId: process.env.EXT_OWNER_ID
}

// Verify the header and the enclosed JWT.
function verifyAndDecode (header) {
  if (header.startsWith(bearerPrefix)) {
    try {
      const token = header.substring(bearerPrefix.length);
      return jsonwebtoken.verify(token, secret, { algorithms: ['HS256'] });
    }
    catch (ex) {
      throw Boom.unauthorized(STRINGS.invalidJwt);
    }
  }
  throw Boom.unauthorized(STRINGS.invalidAuthHeader);
}

// params: channel_id
router.get('/sketches', async (req, res) => {
  //let payload = verifyAndDecode(req.headers.authorization)
  let sketches = await getSketchesByChannel(req.query.channel_id)
  res.json(sketches)
})

// params: channel_id
router.post('/sketches', async (req, res) => {
  //let payload = verifyAndDecode(req.headers.authorization)
  const { user_id, display_name, sketch } = req.body
  const { channel_id } = req.query

  console.log(user_id);
  console.log(display_name);
  console.log(sketch);

  let newSketch = await createSketchInChannel(
    channel_id, user_id, display_name, sketch)

  // pubsub broadcast
    /*broadcastToAll({
    event: 'create-sketch',
    sketch: newSketch
  }, makeServerToken(channelId), channelId)
  */

  res.json(newSketch);
})

// params: sketch_id
router.delete('/sketches', async (req, res) => {
  //let payload = verifyAndDecode(req.headers.authorization)
    /*const { role } = payload;

  if (role !== "broadcaster" || role !== "moderator") {
    res.json({ errors: ["Unauthorized action"] })
  }*/

  let ret = await deleteSketch(req.query.sketch_id)
    /*broadcastToAll({
    event: 'delete-sketch',
    sketch_id: req.query.sketch_id
  }, makeServerToken(channelId), channelId)
  */

  //res.json({status: 'deleted'})
  res.json(ret);
})

function makeServerToken(channelId) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
    channel_id: channelId,
    user_id: ext.ownerId, // extension owner ID for the call to Twitch PubSub
    role: 'external',
    pubsub_perms: {
      send: [ '*' ],
    },
  }

  //const secret = Buffer.from(ext.secret, 'base64');
  const secret = Buffer.from("REPLACE LATER", 'base64');
  return jwt.sign(payload, secret, { algorithm: 'HS256' });
}

const createSketchInChannel = async (channelId, userId, displayName, sketch) => {
  const id = uuidv4();
  var params = {
    TableName: sketchesTable,
    Item: {
      sketch_id: id, channel_id: channelId, user_id: userId, display_name: displayName, sketch
    },
  }

  try{
    let data = await dynamodb.put(params).promise()
    console.log(`Created sketch for channel_id: ${channelId} by user_id: ${userId} (${displayName})`)
    return params.Item;
  } catch(error) {
    return error;
  }
}

const deleteSketch = async (sketchId) => {
  var params = {
    Key: {
      "sketch_id": sketchId
    },
    TableName: sketchesTable
  };
  try {
    let data = dynamodb.delete(params).promise()
    console.log(`Deleted sketch from channel sketch_id: ${sketchId}`)
    return data;
  }
  catch(err) {
    console.log(err);
  }

}

const getSketchesByChannel = async (channelId) => {
  var params = {
    ExpressionAttributeValues: {
      ":channelId": channelId
    },
    KeyConditionExpression: "channel_id = :channelId",
    TableName: sketchesTable,
    ProjectionExpression: "sketch",
    IndexName: "Channel"
  };

  try {
    let data = await dynamodb.query(params).promise();
    console.log(`Fetched sketches for channel_id: ${channelId}`)
    return data.Items;
  }
  catch(err) {
    console.log(err);
  }
}

const broadcastToAll = async (data, token, channelId) => {
  // use twitch pubsub

  fetch(`https://api.twitch.tv/extensions/message/${channelId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content_type: 'application/json',
      message: JSON.stringify(data),
      targets: ['broadcast']
    })
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
    })
    .catch(err => { console.log(err) });
}

// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)

// Export your express server so you can import it in the lambda function.
module.exports = app
