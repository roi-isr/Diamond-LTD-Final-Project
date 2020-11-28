import React from 'react';
import './App.css';
import Header from './Components/Header'
import Footer from './Components/Footer'
import Homepage from './Components/Homepage'
import Store from './Components/VirtualStore'
import QA from './Components/QA'
import Contact from './Components/Contact'
import About from './Components/About'
import Sign from './Components/SigninForm'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

function App() {
  return (
    <React.Fragment>
      <Header />
      <hr className="page-seperator" />
      <Router>
        <Switch>
          <Route path="/" exact><Homepage /></Route>
          <Route path="/sign"><Sign /></Route>
          <Route path="/home"><Homepage /></Route>
          <Route path="/store"><Store /></Route>
          <Route path="/about"><About /></Route>
          <Route path="/qa"><QA /></Route>
          <Route path="/contact"><Contact /></Route>
        </Switch>
      </Router>
      <hr className="page-seperator" />
      <Footer />
    </React.Fragment>
  );
}

export default App;
