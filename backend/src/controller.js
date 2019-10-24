const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const sketches = require('./sketches')

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

const getAllChannelSketches = async (req, res) => {
  //let payload = verifyAndDecode(req.headers.authorization)
  let results = await sketches.getChannelAll(req.query.channel_id)
  res.json(results)
  //res.json({ message: 'GETSKETCHS API Powered by AWS Lambda!' })
}

const createSketch = async (req, res) => {
  //let payload = verifyAndDecode(req.headers.authorization)
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
  //let payload = verifyAndDecode(req.headers.authorization)
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
