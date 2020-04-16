import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Listdelproj from "../assets/listdelproj";
import { Paper } from "@material-ui/core";
import { withAlert } from "react-alert";
const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  button: {
    padding: theme.spacing(2),
  },
}));

class DeleteProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectid: [],
      selected: 0,
      deleteflag: 0,
      projects: [
        {
          projectid: 2,
          name: "BBBBBBBBBBBBB",
          date: "12-4-20",
          path: "git:arpit-vaghela:a",
          username: "arpit-vaghela",
          description: "This is a longer detailed description",
          shortdescription: "Something there",
        },
        {
          projectid: 2,
          name: "BBBBBBBBBBBBB",
          date: "12-4-20",
          path: "git:arpit-vaghela:a",
          username: "arpit-vaghela",
          description: "This is a longer detailed description",
          shortdescription: "Something there",
        },
      ],
      username: "",
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }
  handleUpdate(projid, number) {
    this.setState({ projectid: projid, selected: number, deleteflag: 1 });
  }
  componentDidUpdate() {
    if (this.state.deleteflag === 1) {
      this.setState({ deleteflag: 0 });
      this.props.alert.success("sucessfully deleted");
      this.props.handleToUpdate();

      //call delete here
    }
  }
  componentWillMount() {
    this.setState({ username: this.props.username });
  }
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Listdelproj
          project={this.state.projects}
          handleToUpdate={this.handleUpdate}
        />
      </Paper>
    );
  }
}

export default withAlert()(withStyles(useStyles)(DeleteProject));
