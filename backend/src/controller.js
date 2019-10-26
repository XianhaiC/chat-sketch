const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const sketches = require('./sketches')
require('dotenv').config()

const secret = Buffer.from(process.env.EXT_SECRET, 'base64')
const client_id = process.env.EXT_CLIENT_ID
const bearerPrefix = 'Bearer '

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// Verify the header and the enclosed JWT.
function verifyAndDecode (header) {
  if (header.startsWith(bearerPrefix)) {
    try {
      const token = header.substring(bearerPrefix.length)
      return jwt.verify(token, secret, { algorithms: ['HS256'] })
    }
    catch (ex) {
      return false
    }
  }
  return false
}

function makeServerToken(channelId) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
    channel_id: channelId,
    user_id: client_id,
    role: 'external',
    pubsub_perms: {
      send: [ '*' ],
    },
  }

  return jwt.sign(payload, secret, { algorithm: 'HS256' });
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

const getAllChannelSketches = async (req, res) => {
  let payload = verifyAndDecode(req.headers.authorization)
  if (!payload) {
    // return error
    res.json({ error: "Invalid auth token." });
  }
  let results = await sketches.getChannelAll(req.query.channel_id)
  res.json(results)
  //res.json({ message: 'GETSKETCHS API Powered by AWS Lambda!' })
}

const createSketch = async (req, res) => {
  let payload = verifyAndDecode(req.headers.authorization)
  if (!payload) {
    // return error
    res.json({ error: "Invalid auth token." });
  }
  const { user_id, display_name, sketch } = req.body
  const { channel_id } = req.query

  console.log(user_id);
  console.log(display_name);
  console.log(sketch);

  let newSketch = await sketches.create(
    channel_id, user_id, display_name, sketch)

  // pubsub broadcast
    /*broadcastToAll({
    event: 'create-sketch',
    sketch: newSketch
  }, makeServerToken(channelId), channelId)
  */

  res.json(newSketch);
}

const deleteSketch = async (req, res) => {
  let payload = verifyAndDecode(req.headers.authorization)
  if (!payload) {
    // return error
    res.json({ error: "Invalid auth token." });
  }
    /*const { role } = payload;

  if (role !== "broadcaster" || role !== "moderator") {
    res.json({ errors: ["Unauthorized action"] })
  }*/

  let ret = await sketches.delete(req.query.sketch_id)
    /*broadcastToAll({
    event: 'delete-sketch',
    sketch_id: req.query.sketch_id
  }, makeServerToken(channelId), channelId)
  */

  //res.json({status: 'deleted'})
  res.json(ret);
}

// params: channel_id
router.get('/sketches', getAllChannelSketches);

// params: channel_id
router.post('/sketches', createSketch);

// params: sketch_id
router.delete('/sketches', deleteSketch);

module.exports = router;
