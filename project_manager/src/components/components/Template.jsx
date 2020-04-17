import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";

const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

class AddProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: "b",
    };
  }
  render() {
    const { classes } = this.props;
    return;
  }
}

export default withStyles(useStyles)(AddProject);
