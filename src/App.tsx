import React, { useState } from "react";
import './App.css';
import GridView from './components/GridView';
import { OpenAPI } from './client';

OpenAPI.BASE = 'http://localhost:8000'

function App() {
  return (
    <div>
      <div className="title">
        Welcome you stinkin' Vandal
      </div>
      <GridView />
    </div >
  )
}

export default App;