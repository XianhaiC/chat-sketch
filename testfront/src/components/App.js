import React from 'react'
import Authentication from '../util/Authentication/Authentication'
import EBS from '../ebs';


const twitch = window.Twitch.ext;
const ebs = new EBS();

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.Authentication = new Authentication()

    this.state={
      finishedLoading:false,
      theme:'light',
      isVisible:true,
      userId: null,
      channelId: null,
      displayName: null,
      sketch: ""
    }
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
    twitch.onAuthorized((auth)=>{
      if(!this.state.finishedLoading){
        // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

        // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
        this.setState(()=>{
          return {finishedLoading:true}
        })
      }

      ebs.setToken(auth.token);

      const authedUser = twitch.viewer;
      console.log("TWITCH");
      console.log(twitch);

      const channelId = auth.channelId;

      if (!authedUser.isLinked) {
        this.setState({ channelId });
        return;
      }

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
    })

    twitch.listen('broadcast',(target,contentType,body)=>{
      twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
      // now that you've got a listener, do something with the result... 

      // do something...

    })

    twitch.onVisibilityChanged((isVisible,_c)=>{
      this.visibilityChanged(isVisible)
    })

    twitch.onContext((context,delta)=>{
      this.contextUpdate(context,delta)
    })
  }

  componentWillUnmount(){
    twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
  }

  render(){
    if(this.state.finishedLoading && this.state.isVisible){
      return (
        <div className="App">
          <div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'} >
            <p>Hello world!</p>
          </div>
        </div>
      )
    }else{
      return (
        <div className="App">
        </div>
      )
    }

  }
}
