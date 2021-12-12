import React from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  let navigate = useNavigate();

  return (
    <div>
      <section
        id="hero"
        className="hero d-flex align-items-center"
        style={{ marginTop: "10rem" }}
      >
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 d-flex flex-column justify-content-center"
              style={{ color: "#193498", fontFamily: "Georgia" }}
            >
              <h2
                data-aos="fade-up"
                style={{ fontWeight: "900", fontSize: "36px" }}
              >
                {" "}
                Got Chess ? <br /> Choose your weapon.
              </h2>
              <h4
                data-aos="fade-up"
                data-aos-delay="400"
                style={{
                  color: "white",
                  marginBottom: "14px",
                }}
              >
                {`“Chess is life in miniature. Chess is a struggle, chess battles.” – Garry Kasparov`}
              </h4>
              <div data-aos="fade-up" data-aos-delay="600">
                <div className="text-center text-lg-start">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      width: "12rem",
                      height: "3rem",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                    onClick={() => navigate("/new_game")}
                  >
                    Start A Game
                  </button>

                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 hero-img"
              data-aos="zoom-out"
              data-aos-delay="200"
            >
              <img
                src="https://raw.githubusercontent.com/qazi9amaan/ChessOn/eb4818886c8cfad15317601746e3cff3f9cd1bc7/public/assets/img/hero-img.svg"
                className="img-fluid"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
