import React, { useState } from 'react';
import {connect} from 'react-redux';
import Axios from 'axios';
import { History } from "../../utils";

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

import * as style from '../../app/login/style';
import * as AuthActions from '../../store/actions/auth';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: "100%",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    width: "100%",
    height: "60px"

  },
}));

const Login = ({Authenticate}) => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function login(credencials) {
    Axios.post("/users/api/login", credencials).then( response => {
      const token = response.data.token
      localStorage.setItem("token", token);
      Authenticate(true, response.data),
      History.push("/home/");
    }).catch( error => {
      localStorage.removeItem("token");
      History.push("/");
    });
  }

  return (
    <>
      <style.BackGround>
        <style.Login>
          <style.Title>UFFacilitador</style.Title>
          <TextField
              id="outlined-search"
              name="usuario"
              label="Usuário"
              type="text"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              onChange={ event => {
                setUsername(event.target.value)
              }}
          />

          <TextField
              id="outlined-search"
              name="senha"
              label="Senha"
              type="password"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
              onChange={ event => {
                setPassword(event.target.value);
              }}
          />

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            size="large"
            onClick={() => login({ username, password }) }>
            <b>Entrar</b>
          </Button>
        </style.Login>
      </style.BackGround>
    </>
  );
};

const mapStateToProps = state => ({ navBarState: state });

const mapDispatchToProps = dispatch => ({
  Authenticate: (status, token) => dispatch(AuthActions.auth(status, token))

});


export default connect(mapStateToProps, mapDispatchToProps)(Login);
