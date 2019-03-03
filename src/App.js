import React, { Component } from 'react';
import './App.css';
import Player from './components/Player'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Jump By Van Halen</h1>
        <Player></Player>
      </div>
    );
  }
}

export default App;
