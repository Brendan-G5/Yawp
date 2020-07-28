import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios';

export class home extends Component {
  state = {
    yawps: null
  }
  componentDidMount(){
    axios.get('/yawps')
      .then(res => {
        this.setState({
          yawps: res.data
        })
      })
      .catch(err => console.error(err))
  }
  render() {
    let recentYawpsMarkup = this.state.yawps ? (
    this.state.yawps.map(yawp => <p>{yawp.body}</p>)
    ) : <p>Loading...</p>
    return (
    <Grid container spacing={3}>
      <Grid item sm={8} xs={12}>
      {recentYawpsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
      <p>Profile</p>
      </Grid>
    </Grid>
    );
  }
}

export default home;
