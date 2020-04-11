import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/DashBoard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { createBrowserHistory } from "history";
// var hist = createBrowserHistory();

function App() {
  return (
    <Router>
      <Switch>
        {/* <Route path="/landing-page" component={LandingPage} /> */}
        {/* <Route path="/profile-page" component={ProfilePage} /> */}
        <Route path="/login-page" component={Login} />
        <Route path="/signup-page" component={SignUp} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
