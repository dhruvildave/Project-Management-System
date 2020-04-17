import React from "react";
// import logo from "./logo.svg";
// import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DashBoard from "./DashBoard";
import Projects from "./Projects";
// import { createBrowserHistory } from "history";
// var hist = createBrowserHistory();

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.location.state.username,
      authenticated: this.props.location.state.authenticated,
    };
  }
  render() {
    return (
      <Router>
        <Switch>
          {/* <Route path="/landing-page" component={LandingPage} /> */}
          {/* <Route path="/profile-page" component={ProfilePage} /> */}
          <Route
            path="/mainpage"
            component={() => (
              <DashBoard
                username={this.state.username}
                authenticated={this.state.authenticated}
              />
            )}
          />
          <Route
            path="/mainpage/projects"
            component={() => (
              <Projects
                username={this.state.username}
                authenticated={this.state.authenticated}
              />
            )}
          />
          <Route path="/mainpage/tasks" />
          <Route path="/mainpage/reports" />
          <Route path="/mainpage/analytics" />
          <Route path="/mainpage/settings" />
          <Route path="/mainpage/profile" />
        </Switch>
      </Router>
    );
  }
}

export default MainPage;
