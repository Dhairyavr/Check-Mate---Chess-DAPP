import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    address: "",
    tokenStaked: "",
    gameId: "0",
    usd_value: "0",
    paymentDone: false,
    winner_address: "",
    opponent_address: "",
  },
  reducers: {
    selectToken: (state, action) => {
      state.tokenStaked = action.payload.address;
      state.usd_value = action.payload.usd;
    },
    setgameId: (state, action) => {
      state.gameId = action.payload;
    },
    setPayment: (state, action) => {
      state.paymentDone = action.payload;
    },
    setWinner: (state, action) => {
      state.winner_address = action.payload;
    },
    setUser: (state, action) => {
      state.address = action.payload;
    },
    setOpponentaddress: (state, action) => {
      state.opponent_address = action.payload;
    },
  },
});

export const {
  selectToken,
  setgameId,
  setPayment,
  setWinner,
  setUser,
  setOpponentaddress,
} = userSlice.actions;

export default userSlice.reducer;
