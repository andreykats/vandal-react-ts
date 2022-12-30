import React, { useState } from "react";
import './App.css';
import GridView from './components/GridView';
import { OpenAPI } from './client';

OpenAPI.BASE = 'http://127.0.0.1:8000'

function App() {
  return (
    <div>
      <GridView />
    </div >
  )
}

export default App;