import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Chessboard from "chessboardjsx";
import Chess from "chess.js";
import chessboard_img from "./chessboard_img.png";
import { useNavigate, useParams } from "react-router-dom";
import Details from "./Details";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ChessGame from "../ethereum/chess";
import web3 from "../ethereum/web3";
import { setgameId, setOpponentaddress, setWinner } from "../redux/user";
import { useSelector, useDispatch } from "react-redux";
import chess_move from "./chess_move.mp4";

const audio = new Audio(chess_move);
const socket = io("http://localhost:8000", {
  transports: ["websocket", "polling", "flashsocket"],
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  borderRadius: "15px",
  bgcolor: "background.paper",
  border: "5px solid #000",
  boxShadow: 24,
  p: 4,
};

const Game = () => {
  let { game_id } = useParams();
  console.log("game_id", game_id);

  let game = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let user_address = useSelector((state) => state.user.address);
  let opponent_address = useSelector((state) => state.user.opponent_address);
  let paymentDone = useSelector((state) => state.user.paymentDone);
  let redux_game_id = useSelector((state) => state.user.gameId);
  let winner_address = useSelector((state) => state.user.winner_address);

  const [startGame, SetstartGame] = useState(false);
  const [fen, Setfen] = useState("start");
  const [color, Setcolor] = useState("white");
  const [socket_id, Setsocket_id] = useState("");
  const [dropSquareStyle, SetdropSquareStyle] = useState({});
  const [Modalflag, Setmodalflag] = useState(false);
  const [Modaltitle, Setmodaltitle] = useState("");
  const [Modalcontent, Setmodalcontent] = useState("");
  const [squareStyles, SetsquareStyles] = useState({});

  const [pieceSquare, SetpieceSquare] = useState("");

  const [history, Sethistory] = useState([]);
  const [otherplayerhistory, Setotherplayerhistory] = useState([]);

  const removeHighlightSquare = () => {
    SetsquareStyles(squareStyling({ pieceSquare, history }));
  };

  const squareStyling = ({ pieceSquare, history }) => {
    //console.log(pieceSquare, history);
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
    };
  };

  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              border: "5px solid blue",
            },
          },
          ...squareStyling({
            history: history,
            pieceSquare: pieceSquare,
          }),
        };
      }
    );

    SetsquareStyles({ ...squareStyles, ...highlightStyles });
  };

  const onDrop = async ({ sourceSquare, targetSquare }) => {
    if (
      game.current.game_over() === true ||
      (game.current.turn() === "w" && color === "black") ||
      (game.current.turn() === "b" && color === "white")
    ) {
      return;
    }
    let move = await game.current.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    console.log("Drop");

    if (move === null) return;
    else {
      Setfen(game.current.fen());
      console.log(game.current.history({ verbose: true }));
      Sethistory([...history, game.current.history({ verbose: true })[0]]);
      SetsquareStyles(squareStyling({ pieceSquare, history }));
      socket.emit("move", game.current.fen(), game_id, socket_id, [
        ...history,
        game.current.history({ verbose: true })[0],
      ]);
      audio.play();
    }
  };

  const onMouseOverSquare = (square) => {
    let moves = game.current.moves({
      square: square,
      verbose: true,
    });

    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }
    console.log(squaresToHighlight);
    highlightSquare(square, squaresToHighlight);
  };

  const onDragStart = (source, piece) => {
    console.log(game.current.turn(), color);
    if (
      game.current.game_over() === true ||
      (game.current.turn() === "w" && color === "black") ||
      (game.current.turn() === "b" && color === "white")
    ) {
      return false;
    }
  };
  const onMouseOutSquare = (square) => removeHighlightSquare(square);

  const onDragOverSquare = (square) => {
    SetdropSquareStyle(
      square === "e4" || square === "d4" || square === "e5" || square === "d5"
        ? { backgroundColor: "cornFlowerBlue" }
        : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    );
  };

  const onSquareClick = async (square) => {
    SetsquareStyles(squareStyling({ pieceSquare: square, history }));
    SetpieceSquare(square);

    if (
      game.current.game_over() === true ||
      (game.current.turn() === "w" && color === "black") ||
      (game.current.turn() === "b" && color === "white")
    ) {
      return;
    }

    let move = await game.current.move({
      from: pieceSquare,
      to: square,
      promotion: "q",
    });

    if (move === null) return;
    else {
      Setfen(game.current.fen());
      Sethistory([...history, game.current.history({ verbose: true })[0]]);
      console.log(fen);
      SetpieceSquare("");
      socket.emit("move", game.current.fen(), game_id, socket_id, [
        ...history,
        game.current.history({ verbose: true })[0],
      ]);
      audio.play();
    }
  };

  const onSquareRightClick = (square) =>
    SetsquareStyles({
      [square]: { backgroundColor: "deepPink" },
    });

  const Setdata = async () => {
    if (paymentDone === true && winner_address === "") {
      socket.emit("JoinGame", game_id, user_address);

      socket.on("UpdatedMoves", (fen, history) => {
        game.current = new Chess(fen.toString());
        Setfen(fen.toString());
        Setotherplayerhistory(history);
        console.log("Updated move");
      });

      socket.on("StartGame", (colour, _socket_id, _opponent_address) => {
        SetstartGame(true);
        Setsocket_id(_socket_id);
        Setcolor(colour);
        game.current = new Chess();
        dispatch(setOpponentaddress(_opponent_address));
        console.log("Started Game", color, _opponent_address);
      });

      socket.on("Winner", (winner) => {
        console.log("Winner is ", winner);
        dispatch(setWinner(winner));
        Setmodaltitle("Congratulations on Winning the Game ");
        Setmodalcontent(
          "Click on Retreive Payout Button to get your Winning Amount"
        );
        Setmodalflag(true);
      });
    }
  };

  useEffect(() => {
    Setdata();
    // eslint-disable-next-line
  }, [
    startGame,
    fen,
    color,
    otherplayerhistory,
    history,
    paymentDone,
    opponent_address,
    winner_address,
  ]);

  const getGameid = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);

    const id = await ChessGame.methods
      .urlGameidtocontractGamid(`${game_id}`)
      .call({ from: accounts[0] });

    if (id !== 0) {
      dispatch(setgameId(id.toString()));
    } else {
      alert("No game active on this socket");
    }

    console.log("Game id", redux_game_id);

    const details = await ChessGame.methods
      .activeGames(parseInt(redux_game_id))
      .call({ from: accounts[0] });

    console.log(
      "Player Count",
      details.player_count,
      parseInt(details.player_count) === 2
    );

    if (parseInt(details.player_count) === 2) {
      console.log("Extra player", socket.id);
      // Setmodalflag(true);
      // Setmodaltitle("No more players allowed");
      // Setmodalcontent("2 players are already in the game try another game");
      socket.emit("Error", socket.id);
    }
  };

  useEffect(() => {
    getGameid();
    // eslint-disable-next-line
  }, [redux_game_id, socket]);

  const Checkconditions = () => {
    if (game.current) {
      if (game.current.in_check() && game.current.turn() === color[0]) {
        console.log("check", game.current.turn(), color[0]);
      }
      if (game.current.in_checkmate() && game.current.turn() === color[0]) {
        console.log("checkmate", game.current.turn(), color[0]);
        dispatch(setWinner(opponent_address));
        Setmodalflag(true);
        Setmodaltitle("Unfortunately You have Lost the Game");
        Setmodalcontent("Better luck next time !!");
        socket.emit("Result", game_id, opponent_address);
      }
    }
  };
  useEffect(() => {
    Checkconditions();
    // eslint-disable-next-line
  }, [fen]);

  useEffect(() => {
    socket.on("Status", (msg) => {
      console.log(msg);
      Setmodalflag(true);
      Setmodaltitle("No more players allowed");
      Setmodalcontent("2 players are already in the game try another game");
    });
    // eslint-disable-next-line
  }, [socket, Modalflag, Modalcontent]);

  console.log(
    fen,
    startGame,
    history,
    color,
    redux_game_id,
    user_address,
    opponent_address,
    winner_address
  );

  const onClose = () => {
    if (winner_address === user_address && user_address.length > 1) {
      Setmodalflag(false);
    } else {
      Setmodalflag(false);
      navigate("/");
    }
  };
  return (
    <div className="App">
      <section className="hero mt-0 pt-3">
        <div className="container-fluid ">
          <Modal
            open={Modalflag}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={style}
              style={{
                color:
                  winner_address === user_address && user_address.length > 1
                    ? "#00917c"
                    : "#FF0000",
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                style={{ fontSize: "20px", fontWeight: "900" }}
              >
                {Modaltitle}
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
                style={{ fontSize: "16px", fontWeight: "500" }}
              >
                {Modalcontent}
              </Typography>
            </Box>
          </Modal>

          <div className="row ">
            <Details
              p1_history={history}
              p2_history={otherplayerhistory}
              startGame={startGame}
            />
            <div className="col">
              {startGame ? (
                <>
                  <span style={{ color: "white" }}>{opponent_address}</span>
                  <Chessboard
                    width={770}
                    position={fen}
                    orientation={color}
                    onDrop={onDrop}
                    onDragStart={onDragStart}
                    onMouseOverSquare={onMouseOverSquare}
                    onMouseOutSquare={onMouseOutSquare}
                    boardStyle={{
                      borderRadius: "5px",
                      boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
                    }}
                    squareStyles={squareStyles}
                    dropSquareStyle={dropSquareStyle}
                    onDragOverSquare={onDragOverSquare}
                    onSquareClick={onSquareClick}
                    onSquareRightClick={onSquareRightClick}
                  />
                  <span style={{ color: "white" }}>{user_address}</span>
                </>
              ) : (
                <>
                  <img
                    src={chessboard_img}
                    alt="asdas"
                    style={{ height: "50rem" }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Game;
