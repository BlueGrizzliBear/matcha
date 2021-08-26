import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './Home';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", dbResponse: "", userHomeResponse: "" };

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

  callUserHome() {
    // catch the username if exist or null
    fetch("http://localhost:9000/")
    .then(res => res.json())
    .then(data => {
      this.setState( {userHomeResponse: data.user} )
    })
    .catch(console.error);
  }

  callLogin() {
    // catch the username if exist or null
    fetch("http://localhost:9000/login")
    .then(res => res.json())
    .then(data => {
      this.setState( {userHomeResponse: data.user} )
    })
    .catch(console.error);
  }

  componentWillMount() {
      this.callAPI();
      this.callDB();
      this.callUserHome();
  }

  render () {
    return (
      <div className="App">
        <Home />
        <p className="App-intro">{this.state.apiResponse}</p>
        <p className="App-intro">{this.state.dbResponse}</p>
      </div>
    );
  }
}

export default App;
