const AWS = require('aws-sdk');
const uuid = require('uuidv4').default
var dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

const sketchesTable = 'Sketches'

// model for sketches
// functions to perform CRUD updates on Sketches table in DynamoDB

module.exports.create = async (channelId, userId, displayName, sketch) => {
  const id = uuid();
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

module.exports.delete = async (sketchId) => {
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

module.exports.getChannelAll = async (channelId) => {
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

