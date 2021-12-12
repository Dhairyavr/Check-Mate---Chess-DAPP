import React, { useEffect } from "react";
import chessboard_img from "./chessboard_img.png";
import Details from "./Details";
const CreateNewGame = () => {
  useEffect(() => {}, []);

  return (
    <div>
      <section className="hero mt-0 pt-3">
        <div className="container-fluid ">
          <div className="row ">
            <Details p1_history={[]} p2_history={[]} startGame={false} />
            <div className="col">
              <img
                src={chessboard_img}
                alt="adas"
                style={{ height: "50rem" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateNewGame;
