import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FileCopy from "@material-ui/icons/FileCopy";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { ListItemSecondaryAction, Checkbox, Button } from "@material-ui/core";
import { withAlert } from "react-alert";
//  import Card from "./Card";
// import ListSubheader from "@material-ui/core/ListSubheader";
const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(2),
  },
  root: {
    display: "flex",
  },
}));
class Listdelfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      del: [],
      selected: 0,
    };
    // this.managestate = this.managestate.bind(this);
  }

  componentDidUpdate() {
    if (this.state.selected > 1) {
      this.props.alert.info("deleting more than one file");
    }
  }

  render() {
    const { classes } = this.props;
    let list = this.props.file.map((file) => (
      <>
        <ListItem button>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <FileCopy />
            </Avatar>
          </ListItemAvatar>
          <Grid container direction="column">
            <Typography variant="h6">{file.filename}</Typography>

            <ListItemText
              primary={`Last updated: ` + file.lastupdated}
            ></ListItemText>
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={(event) => {
                  if (event.target.checked) {
                    let okay = this.state.del;
                    this.setState({ del: okay.concat([file.fileid]) });
                    this.setState({ selected: this.state.selected + 1 });
                  } else {
                    let okay = this.state.del;
                    const index = okay.indexOf(file.fileid);
                    if (index > -1) {
                      okay.splice(index, 1);
                    }
                    this.setState({ del: okay });
                    this.setState({ selected: this.state.selected - 1 });
                  }
                  console.log("selected:" + this.state.selected);
                }}
              />
            </ListItemSecondaryAction>
            {/* <Card project={this.props.project}></Card> */}
          </Grid>
        </ListItem>
      </>
    ));
    let button = (
      <Grid container justify="center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={(event) =>
            this.props.handleToUpdate(this.state.del, this.state.selected)
          }
        >
          Delete File/Files
        </Button>
      </Grid>
    );
    return [button, list];
  }
}

export default withAlert()(withStyles(useStyles)(Listdelfile));
