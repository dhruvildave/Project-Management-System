import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import DashBoard from "./components/DashBoard";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";
import Reports from "./components/Reports";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import Profiles from "./components/Profiles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
};

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: blue,
    type: "light",
  },
  status: {
    danger: "orange",
  },
});

function App() {
  return (
    <Provider template={AlertTemplate} {...options}>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            {/* <Route path="/landing-page" component={LandingPage} /> */}
            {/* <Route path="/profile-page" component={ProfilePage} /> */}
            <Route path="/login-page" component={Login} />
            <Route path="/signup-page" component={SignUp} />
            <Route path="/dashboard" component={DashBoard} />
            <Route path="/projects" component={Projects} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/reports" component={Reports} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile" component={Profiles} />
            <Route path="/" component={Login} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
