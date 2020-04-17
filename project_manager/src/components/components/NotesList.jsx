import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import clsx from "clsx";
import Listnotes from "../assets/listnotes";
import AddNote from "./AddNote";
import DeleteNote from "./DeleteNote";

const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    display: "flex",
    alignItems: "center",
  },
  innerpaper: {
    display: "flex",
    width: "100%",
    // maxWidth: "100%",
  },
}));

class AddProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "view",
      notes: [],
      username: "",
      projectid: "",
      fetchmethod: "user", // or project
    };
    this.pageUpdate = this.pageUpdate.bind(this);
  }
  pageUpdate() {
    this.setState({ action: "view" });
    // this.setState()
  }
  handleDelete(somearg) {
    let notesid = somearg;
    //call delete here
    console.log(notesid);
    //change viewname on success
    //return alert error
  }
  componentWillMount() {
    if (this.props.projectid === undefined) {
      this.setState({ fetchmethod: "user" });
    } else {
      this.setState({ fetchmethod: "project" });
    }
    this.setState({
      notes: [
        {
          noteid: 1,
          title: "Okay",
          description: "hmmm this is one note",
          color: "red",
        },
        {
          noteid: 2,
          title: "Okay",
          description: "hmmm this is one note",
          color: "blue",
        },
        {
          noteid: 3,
          title: "Okay",
          description: "hmmm this is one note",
          color: "green",
        },
        {
          noteid: 1,
          title: "Okay",
          description: "hmmm this is one note",
          color: "red",
        },
        {
          noteid: 2,
          title: "Okay",
          description: "hmmm this is one note",
          color: "blue",
        },
        {
          noteid: 3,
          title: "Okay",
          description: "hmmm this is one note",
          color: "green",
        },
      ],
    });

    ///fetch notes here
  }

  render() {
    let body;
    const { classes } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    if (this.state.action === "view") {
      body = (
        <Listnotes notes={this.state.notes} handleToUpdate={this.pageUpdate} />
      );
    }
    if (this.state.action === "add") {
      body = (
        <AddNote
          username={this.state.username}
          projectid={this.state.username}
          fetchmethod={this.state.fetchmethod}
          handleToUpdate={this.pageUpdate}
        />
      );
    }
    if (this.state.action === "delete") {
      body = (
        <DeleteNote
          username={this.state.username}
          projectid={this.state.username}
          fetchmethod={this.state.fetchmethod}
          handleToUpdate={this.pageUpdate}
          notes={this.state.notes}
        />
      );
    }

    return (
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <Typography variant="h5">Your Notes</Typography>
          <Grid container item justify="center" direction="row">
            <Button
              color="primary"
              aria-label="edit"
              className={classes.buttonclass}
              onClick={(event) => this.setState({ action: "add" })}
            >
              Add Note
            </Button>
            <Button
              color="primary"
              aria-label="edit"
              className={classes.buttonclass}
              onClick={(event) => this.setState({ action: "delete" })}
            >
              Delete
            </Button>
          </Grid>
          {body}
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(AddProject);
