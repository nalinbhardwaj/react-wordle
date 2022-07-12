import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { AlertProvider } from './context/AlertContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Verify from './Verify'

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider>
      <Router>
        <Routes>
          <Route path="/verify/:ipfsHash" element={<Verify />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
