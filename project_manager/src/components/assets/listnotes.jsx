import React from "react";
import ListItem from "@material-ui/core/ListItem";
import { Typography, CssBaseline } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  root: {
    width: "100%",
  },
}));
class Listnotes extends React.Component {
  render() {
    const { classes } = this.props;
    let notes = this.props.notes.map((notes) => (
      <ListItem button>
        <Card className={classes.root}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Your Note
            </Typography>
            <Typography variant="h5" component="h2">
              {notes.title}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              Description
            </Typography>
            <Typography variant="body2" component="p">
              {notes.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Focus</Button>
          </CardActions>
        </Card>
      </ListItem>
    ));
    // console.log(this.props.files);
    return (
      <>
        <CssBaseline />

        {notes}
      </>
    );
    // return filelist;
  }
}

export default withStyles(useStyles)(Listnotes);
