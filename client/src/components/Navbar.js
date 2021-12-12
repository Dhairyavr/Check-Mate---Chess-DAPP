import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { setUser } from "../redux/user";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const address = useSelector((state) => state.user.address);

  const Connect = async () => {
    console.log(window.ethereum);
    if (window.ethereum) {
      await window.ethereum.enable();
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      await window.web3.currentProvider.enable();
      window.web3 = window.web3.currentProvider;
      await window.web3.request({ method: "eth_requestAccounts" });
    }
    const accounts = await window.web3.eth.getAccounts();
    dispatch(setUser(accounts[0].toString()));
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            style={{
              fontSize: "24px",
              fontFamily: "Georgia",
              fontWeight: "900",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <img
              width={40}
              height={40}
              style={{ marginRight: "9px" }}
              src="https://i.pinimg.com/originals/b4/da/d8/b4dad8718ddb5da0d363e488dc24d496.jpg"
              alt="fsdf"
            />
            {"CHECK&MATE"}
          </Typography>

          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            style={{ marginLeft: "50rem" }}
          >
            <Button
              onClick={Connect}
              sx={{ my: 2, color: "white", display: "block" }}
              style={{
                fontSize: "17px",
                fontWeight: "700",
                backgroundColor: "#00A19D",
                marginRight: "2rem",
              }}
            >
              {address.length > 0 ? (
                <>
                  <AccountBalanceWalletIcon /> {address[0]}
                  {address[1]}
                  {address[2]}
                  {address[3]}
                  {address[4]}
                  {address[5]}.....
                  {address.slice(-4)}{" "}
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
            <Button
              onClick={() => {
                navigate("/new_game");
                window.location.reload();
              }}
              sx={{ my: 2, color: "white", display: "block" }}
              style={{
                fontSize: "17px",
                fontWeight: "700",
                backgroundColor: "#00A19D",
              }}
            >
              Start A Game{" "}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
