import React from 'react'
import Authentication from '../util/Authentication/Authentication'
import EBS from '../ebs'
import Canvas from './Canvas'


export default class App extends React.Component{
  constructor(props){
    super(props)
    this.Authentication = new Authentication()

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
    this.twitch = window.Twitch ? window.Twitch.ext : null
    this.ebs = new EBS();
    window.Twitch.ext.rig.log("EBS");
    this.state={
      finishedLoading:false,
      theme:'light',
      isVisible:true,
      displayName: null
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  contextUpdate(context, delta){
    if(delta.includes('theme')){
      this.setState(()=>{
        return {theme:context.theme}
      })
    }
  }

  visibilityChanged(isVisible){
    this.setState(()=>{
      return {
        isVisible
      }
    })
  }

  componentDidMount(){
    if(this.twitch){
      this.twitch.onAuthorized((auth)=>{
        window.Twitch.ext.rig.log(auth);
        this.Authentication.setToken(auth.token, auth.userId)
        window.Twitch.ext.rig.log("AFTER");
        this.ebs.setToken(auth.token);


          /*
        fetch(`https://api.twitch.tv/helix/users?id=${authedUser.id}`, {headers})
          .then((res) => res.json())
          .then((res) => {
            const [user] = res.data;
            const userId = user.id;
            const displayName = user.display_name;

            twitch.rig.log(user);
            this.setState({ channelId, userId, displayName });
          })
          .catch((err) => console.error('Encountered error', err));
          */

        window.Twitch.ext.rig.log("AFTER");
        if(!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(()=>{
            return {finishedLoading:true}
          })
        }
      })

      this.twitch.listen('broadcast',(target,contentType,body)=>{
        this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
        // now that you've got a listener, do something with the result... 

        // do something...

      })

      this.twitch.onVisibilityChanged((isVisible,_c)=>{
        this.visibilityChanged(isVisible)
      })

      this.twitch.onContext((context,delta)=>{
        this.contextUpdate(context,delta)
      })
    }
  }

  componentWillUnmount(){
    if(this.twitch){
      this.twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
    }
  }

  //TODO: perform validation checks
  // user has shared identity
  // user is not banned
  handleSubmit(sketch) {
    const { channelId, userId, displayName } = this.state;
    window.Twitch.ext.rig.log("CREATING WITH");
    window.Twitch.ext.rig.log(channelId);
    window.Twitch.ext.rig.log(userId);
    window.Twitch.ext.rig.log(displayName);
    ebs.createSketch(channleId, userId, displayName, sketch);
  }

  render(){
    if(this.state.finishedLoading && this.state.isVisible){
      return (
        <div className="App">
          <div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'} >
            <Canvas onSubmit={this.handleSubmit} />
          </div>
        </div>
      )
    } 
    else{
      return (
        <div className="App">
        </div>
      )
    }
  }
}
