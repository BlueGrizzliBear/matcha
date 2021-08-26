import React, { Component } from 'react';
import '../assets/stylesheets/Components.css';
import Homepage from './Homepage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", dbResponse: "" };
    
  }

  callAPI() {
      fetch("http://localhost:9000/testAPI")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }));
  }

  callDB() {
    fetch("http://localhost:9000/testDB")
        .then(res => res.text())
        .then(res => this.setState({ dbResponse: res }))
        .catch(err => err);
}

  componentWillMount() {
      this.callAPI();
      this.callDB();
  }

  render () {
    return (
      <>
      	<div className="App">
          <Homepage />
        </div>
      </>
    );
  }
}

/* <div className="App-intro">{this.state.apiResponse}</div>
<div className="App-intro">{this.state.dbResponse}</div> */

export default App;
