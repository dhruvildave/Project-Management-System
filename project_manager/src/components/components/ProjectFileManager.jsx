import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteRounded from "@material-ui/icons/DeleteRounded";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Listfileproj from "./listfileproj";
import { Typography, Paper, CssBaseline, Grid } from "@material-ui/core";
import { ListItem, List } from "@material-ui/core/";
import PeopleIcon from "@material-ui/icons/People";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
// import Typography from '@material-ui/core/Typography';

const useStyles = createStyles((theme) => ({
  divforbutton: {
    flexDirection: "row",
    padding: theme.spacing(1),
  },
  buttonclass: {
    margin: theme.spacing(3),
  },
  grid: {
    flexDirection: "row",
    flexGrow: 1,
  },
  root: {
    display: "flex",
    flexDirection: "row",
  },
  paper: {
    padding: theme.spacing(2),
    width: "90%",
  },
  listroot: {
    width: "100%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

class ProjectFileManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      projectid: 42069,
      fileid: 42069,
      viewname: "allfiles",
    };
    this.handleToUpdate = this.handleToUpdate.bind(this);
  }
  componentWillMount() {
    this.setState({ files: this.props.files, projectid: this.props.projectid });
    // console.log(this.state.files);
    // console.log(this.props.files);
  }
  handleToUpdate(someArg) {
    this.setState({ fileid: someArg, viewname: "onefile" });
  }

  render() {
    const { classes } = this.props;
    let top, mid;
    top = (
      <div className={classes.divforbutton}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.buttonclass}
          onClick={(event) => this.setState({ pagename: "addproject" })}
        >
          <AddIcon />
        </Fab>
        <Fab
          color="secondary"
          aria-label="delete"
          className={classes.buttonclass}
          onClick={(event) => this.setState({ pagename: "deleteproject" })}
        >
          <DeleteRounded />
        </Fab>
      </div>
    );
    if (this.state.viewname === "allfiles") {
      mid = (
        <>
          <CssBaseline />
          <Grid container justify="center" direction="row" spacing={2}>
            <Grid
              item
              direction="row"
              justify="center"
              className={classes.root}
              xs={12}
              sm={6}
            >
              <Paper className={classes.paper}>
                <Typography variant="h4">Your Project Details</Typography>
                <Typography variant="subtitle1">
                  {`Date created:` + this.props.date}
                </Typography>
                <Typography variant="subtitle1">
                  {" "}
                  {`Description:` + this.props.description}{" "}
                </Typography>
                <Typography variant="subtitle1">Project Members:</Typography>
                <List className={classes.listroot}>
                  {
                    <>
                      {this.props.members.map((members) => (
                        <ListItem button>
                          <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                              <PeopleIcon></PeopleIcon>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={members.username}
                            secondary={members.role}
                          />
                        </ListItem>
                      ))}
                    </>
                  }
                </List>
              </Paper>
            </Grid>
            <Grid
              item
              direction="row"
              justify="center"
              className={classes.root}
              xs={12}
              sm={6}
            >
              <Paper className={classes.paper}>
                <Listfileproj
                  files={this.state.files}
                  handleToUpdate={this.handleToUpdate}
                  description={this.state.description}
                />
              </Paper>
            </Grid>
          </Grid>
        </>
      );
    }
    return [top, mid];
  }
}

export default withStyles(useStyles)(ProjectFileManager);
