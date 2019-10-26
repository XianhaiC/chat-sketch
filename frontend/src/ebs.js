export default class EBS {
  constructor() {
    window.Twitch.ext.rig.log("CONSTRUT 2");
    // Change this to a deployed production url before uploading this to Twitch
    this.baseUrl = 'https://localhost:3000/' // make sure the port is set accordingly
    this.token = null;
  }

  setToken(token) {
    window.Twitch.ext.rig.log("SETTING TOKEN");
    this.token = token;
  }

    /*
  doRequest = async (path, method, body={}) => {
    const result = await fetch(this.baseUrl + path, {
      method: method,
      body: body,
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'content-type': 'application/json'
      }
    })
    return result.json();
  }

  post(path, data={}) {
    return this.doRequest(path, 'POST',
      JSON.stringify(data)
    )
  }

  get(path) {
    return this.doRequest(path, 'GET')
  }

  delete(path) {
    return this.doRequest(path, 'DELETE')
  }

  getStatus = async () => {
    return this.get('status');
  }

  getSketches = async (channelId) => {
    return this.get(`sketches?channel_id=${channelId}`);
  }

  createSketch = async (channelId, userId, displayName, sketch) => {
    return this.post(`sketches?channel_id=${channelId}`, {
      user_id: userId,
      display_name: displayName,
      sketch: sketch
    });
  }

  deleteSketch = async (sketchId) => {
    return this.delete(`sketches?sketch_id=${sketchId}`);
  }
  */
}
