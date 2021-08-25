import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './Home';

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
      <div className="App">
        <Home />
        <p className="App-intro">{this.state.apiResponse}</p>
        <p className="App-intro">{this.state.dbResponse}</p>
      </div>
    );
  }
}

export default App;
