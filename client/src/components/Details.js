import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { io } from "socket.io-client";
import Tokens from "./Tokens";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import abi from "../ethereum/erc20";
import Chess from "../ethereum/chess";
import web3 from "../ethereum/web3";
import { setgameId, setPayment, setUser } from "../redux/user";

const Details = ({ p1_history, p2_history, startGame }) => {
  const dispatch = useDispatch();

  let game_id = useSelector((state) => state.user.gameId);
  let paymentDone = useSelector((state) => state.user.paymentDone);
  let us_value = parseFloat(useSelector((state) => state.user.usd_value));
  const token_id = useSelector((state) => state.user.tokenStaked);
  let user_address = useSelector((state) => state.user.address);
  let winner_address = useSelector((state) => state.user.winner_address);

  const [token_value, Settokenvalue] = useState("0");
  const [error, Seterror] = useState("");

  const [input_usd_value, Setinputusdvalue] = useState("0");

  const [tokenset1, Settokenset1] = useState([
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png",
      name: "WETH Token",
      address: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
      selected: false,
      usd_value: "",
    },
    {
      url: "https://pbs.twimg.com/profile_images/1030475757892579334/qvSHhRyC_400x400.jpg",
      name: "LINK Token",
      address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      selected: false,
      usd_value: "",
    },
  ]);

  const [tokenset2, Settokenset2] = useState([
    {
      url: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
      name: "WMATIC Token",
      address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      selected: false,
      usd_value: "",
    },
    {
      url: "https://s2.coinmarketcap.com/static/img/coins/200x200/4943.png",
      name: "DAI Token",
      address: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
      selected: false,
      usd_value: "",
    },
  ]);

  let navigate = useNavigate();

  const Setplayer = async (e) => {
    e.preventDefault();

    if (token_id === "") {
      Seterror("No token selected");
      return;
    } else if (parseFloat(token_value) === 0) {
      Seterror("No Amount Added");
      return;
    } else if (user_address === "") {
      Seterror("No wallet Connected");
      return;
    }
    let _id = await uuidv4();
    const accounts = await web3.eth.getAccounts();
    dispatch(setUser(accounts[0]));

    console.log(
      accounts,
      web3.utils.toChecksumAddress(token_id),
      _id,
      parseInt(Math.ceil(input_usd_value)),
      game_id
    );

    if (game_id === "0") {
      console.log("if", token_id);
      const ERC20 = await new web3.eth.Contract(
        abi,
        web3.utils.toChecksumAddress(token_id)
      );
      var amount = web3.utils.toWei(`${parseFloat(token_value)}`, "ether");
      await ERC20.methods
        .approve("0xFee91fBc28DF4c102A3e006E63AA12C137b576c9", amount)
        .send({ from: accounts[0] });
      console.log("amount", amount);
      try {
        await Chess.methods
          .createMatch(
            web3.utils.toChecksumAddress(token_id),
            accounts[0],
            amount,
            parseInt(Math.ceil(input_usd_value)),
            _id
          )
          .send({ from: accounts[0] });
      } catch (error) {
        alert(error);
        return;
      }

      let current_id =
        (await Chess.methods.game_id().call({ from: accounts[0] })) - 1;

      console.log(current_id);
      dispatch(setgameId(current_id));
      dispatch(setPayment(true));

      const socket = io("http://localhost:8000", {
        transports: ["websocket", "polling", "flashsocket"],
      });

      socket.on("connect", async () => {
        console.log("Connected to Server", socket.id);
        console.log("room id", _id);
        navigate(`/game/${_id.toString()}`);
      });
    } else {
      console.log("else");
      const accounts = await web3.eth.getAccounts();
      dispatch(setUser(accounts[0]));
      let amount = web3.utils.toWei(`${parseFloat(token_value)}`, "ether");

      let match_details = await Chess.methods
        .activeGames(parseInt(game_id))
        .call({ from: accounts[0] });

      if (
        parseInt(Math.ceil(input_usd_value)) < parseInt(match_details.usd_value)
      ) {
        Seterror(
          `Your staking amount should be atleast  $ ${match_details.usd_value}`
        );
        return;
      }
      const ERC20 = await new web3.eth.Contract(
        abi,
        web3.utils.toChecksumAddress(token_id)
      );

      await ERC20.methods
        .approve("0xFee91fBc28DF4c102A3e006E63AA12C137b576c9", amount)
        .send({ from: accounts[0] });

      console.log(
        "Match Details",
        match_details,
        parseInt(Math.ceil(input_usd_value)),
        match_details.usd_value,
        accounts[0]
      );

      try {
        await Chess.methods
          .addPlayer2(
            web3.utils.toChecksumAddress(token_id).toString(),
            parseInt(game_id),
            amount,
            accounts[0]
          )
          .send({ from: accounts[0] });
      } catch (error) {
        alert(error);
        return;
      }
      dispatch(setPayment(true));
    }
  };

  console.log(p1_history, p2_history, input_usd_value, us_value);

  const tableData = (p1_history, p2_history) => {
    let max_len = Math.max(p1_history.length, p2_history.length);

    let values = [];

    for (let i = 0; i < max_len; i++) {
      values.push(
        <tr style={{ width: "100%", overflow: "hidden", display: "flex" }}>
          <td
            style={{
              backgroundColor: "black",
              color: "white",
              height: "auto",
              fontWeight: "800",
              textAlign: "center",
              width: "22rem",
            }}
          >
            {p1_history.length > i && p1_history[i].san}
          </td>
          <td
            class="table-light"
            style={{
              width: "22rem",
              height: "auto",
              textAlign: "center",
              backgroundColor: "#6D8299",
              fontWeight: "800",
              color: "black",
            }}
          >
            {p2_history.length > i && p2_history[i].san}
          </td>
        </tr>
      );
    }
    return values;
  };

  const Setusdvalue = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,LINK,MATIC,DAI&tsyms=USD"
    );
    console.log(tokenset1[0], tokenset2[0].usd_value, response.data);
    Settokenset1(
      tokenset1.map((value) =>
        value.name === "WETH Token"
          ? { ...value, usd_value: response.data.ETH.USD }
          : { ...value, usd_value: response.data.LINK.USD }
      )
    );

    Settokenset2(
      tokenset2.map((value) =>
        value.name === "WMATIC Token"
          ? { ...value, usd_value: response.data.MATIC.USD }
          : { ...value, usd_value: response.data.DAI.USD }
      )
    );
  };

  const WithdrawMoney = async () => {
    console.log(user_address);
    try {
      await Chess.methods
        .withdrawAmount(`${user_address.toString()}`, parseInt(game_id))
        .send({ from: `${user_address.toString()}` });
    } catch (error) {
      alert(error);
      return;
    }
    navigate("/");
  };

  const TransferWinnerAmount = async () => {
    console.log(
      typeof user_address,
      user_address,
      web3.utils.isAddress(user_address)
    );
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    try {
      await Chess.methods
        .transferWinnerAmount(accounts[0], parseInt(game_id))
        .send({
          from: accounts[0],
        });
    } catch (error) {
      alert(error);
      return;
    }
    navigate("/");
  };

  useEffect(() => {}, [
    p1_history,
    p2_history,
    input_usd_value,
    winner_address,
  ]);

  useEffect(() => {
    Setusdvalue();
    // eslint-disable-next-line
  }, []);

  console.log(tokenset1, tokenset2);

  return (
    <div
      className="col-md-6 col-12"
      style={{ height: "50rem", fontFamily: "Georgia" }}
    >
      <div className="wrapper px-2" style={{ height: "100%" }}>
        <div
          className="card"
          style={{ backgroundColor: "#343A40", height: "100%" }}
        >
          {error.length > 0 && (
            <Alert
              severity="error"
              style={{ fontSize: "18px" }}
              action={
                <CloseIcon
                  fontSize="inherit"
                  style={{
                    fontSize: "22px",
                    float: "right",
                  }}
                  onClick={() => Seterror("")}
                />
              }
            >
              <span>{error}</span>
            </Alert>
          )}
          <div className="card-body">
            <Stack
              direction="row"
              spacing={4}
              style={{
                backgroundColor: "#244b7b",
                borderRadius: "10px 10px 0px 0px",
                width: "35rem",
                marginLeft: "4.5rem",
              }}
            >
              {tokenset1.map((token, idx) => (
                <Tokens data={token} selecttoken={Settokenset1} key={idx} />
              ))}
            </Stack>

            <Stack
              direction="row"
              spacing={4}
              style={{
                backgroundColor: "#244b7b",
                width: "35rem",
                marginLeft: "4.5rem",
              }}
            >
              {tokenset2.map((token, idx) => (
                <Tokens data={token} selecttoken={Settokenset1} key={idx} />
              ))}
            </Stack>

            <Stack
              style={{
                backgroundColor: "#244b7b",
                borderRadius: "0px 0px 10px 10px",
                width: "35rem",
                marginLeft: "4.5rem",
              }}
            >
              <form onSubmit={Setplayer}>
                <center>
                  <TextField
                    style={{
                      backgroundColor: "black",
                      borderRadius: "10px",
                      marginBottom: "10px",
                      marginLeft: "5rem",
                      marginRight: "10px",
                    }}
                    required
                    id="outlined-required"
                    value={token_value}
                    label="Enter Token Amount"
                    onChange={(e) => {
                      Settokenvalue(e.target.value);
                      Setinputusdvalue(
                        parseFloat(us_value) * parseFloat(e.target.value)
                      );
                    }}
                  />
                  <span
                    style={{
                      color: "#4E9F3D",
                      fontSize: "18px",
                      fontWeight: "900",
                    }}
                  >
                    $ {parseFloat(input_usd_value)}
                  </span>
                </center>

                <center>
                  <button
                    className="btn btn-primary"
                    style={{ marginBottom: "10px" }}
                    disabled={paymentDone ? true : false}
                  >
                    Stake Tokens
                  </button>
                </center>
              </form>
            </Stack>
            <br />
            <div style={{ width: "100%" }}>
              <Button
                variant="contained"
                style={{
                  border: "2px solid black",
                  boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.3)",
                  backgroundColor: "#FF0000",
                  width: "40%",
                  fontWeight: "600",
                  color: "white",
                  marginLeft: "2rem",
                  marginRight: "3rem",
                }}
                onClick={TransferWinnerAmount}
                disabled={
                  winner_address === user_address && startGame === true
                    ? false
                    : true
                }
              >
                Retreive Price Money
              </Button>
              <Button
                variant="contained"
                style={{
                  border: "2px solid black",
                  backgroundColor: "#00917c",
                  boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.3)",
                  width: "40%",
                  fontWeight: "600",
                  color: "white",
                }}
                onClick={WithdrawMoney}
                disabled={
                  startGame === false && paymentDone === true ? false : true
                }
              >
                Withdraw Amount
              </Button>
            </div>
            <br />
            <h3 style={{ fontFamily: "Georgia", fontWeight: "900" }}>
              {" "}
              Keep Calm <br /> Let's ChessOn !!
            </h3>
            <h4
              className="text-muted "
              style={{ fontFamily: "Georgia", fontWeight: "500" }}
            >
              {`"The blunders are all there on the board, waiting to be made..."`}
            </h4>

            <div id="message-board"></div>
            <div className=" mt-0">
              <h4
                className="text-muted pt-3 pb-2"
                style={{ fontFamily: "Georgia", fontWeight: "700" }}
              >
                Moves history{" "}
              </h4>

              <table
                className="table"
                style={{
                  width: "25rem",
                }}
              >
                <tbody
                  style={{
                    border: "5px solid black",
                    display: "block",
                    overflow: "auto",
                    height: "200px",
                    width: "44rem",
                    borderRadius: "20px",
                  }}
                >
                  {tableData(p1_history, p2_history)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
