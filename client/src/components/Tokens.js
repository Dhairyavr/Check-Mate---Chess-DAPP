import React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import DoneIcon from "@mui/icons-material/Done";
import "./tokens.css";
import { useSelector, useDispatch } from "react-redux";
import { selectToken } from "../redux/user";

const Tokens = ({ data, selecttoken }) => {
  let userdata = useSelector((state) => state.user.tokenStaked);
  const dispatch = useDispatch();
  console.log(userdata);
  return (
    <div>
      <Chip
        className="selected"
        style={{
          backgroundColor: "#102a49",
          width: "15rem",
          height: "4rem",
          fontSize: "16px",
          fontFamily: "Georgia",
          fontWeight: "700",
          marginLeft: "1rem",
          marginBottom: "1rem",
          marginTop: "1rem",
          border: "1px solid black",
          cursor: "pointer",
        }}
        onClick={() => {
          dispatch(selectToken({ address: data.address, usd: data.usd_value }));
          localStorage.setItem("address", data.address.toString());
        }}
        avatar={
          <Avatar
            alt="Natacha"
            style={{ height: "2rem", width: "2.5rem", marginRight: "4px" }}
            src={data.url}
          />
        }
        label={
          <>
            <span>{data.name} </span>
            {userdata === data.address ? (
              <DoneIcon style={{ color: "white", fontSize: "30px" }} />
            ) : null}

            <br />
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                color: "#4E9F3D",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              $ {data.usd_value}
            </span>
          </>
        }
      ></Chip>
    </div>
  );
};

export default Tokens;
