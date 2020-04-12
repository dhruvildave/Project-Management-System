import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

export default function FooterPaper() {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <Typography variant="h6" component="h2">
          <div style={{ display: "flex" }}>
            {/* A Project by <a href="https://github.com/Kaushal1011">Kaushal</a>,"
            "<a href="https://github.com/arpitvaghela">Arpit</a>" "&" "
            <a href="https://github.com/dhruvildave">Dhruvil</a>. */}
            A Project on DBMS By Kaushal, Arpit and Dhruvil.
          </div>
        </Typography>
      </Paper>
    </Grid>
  );
}
