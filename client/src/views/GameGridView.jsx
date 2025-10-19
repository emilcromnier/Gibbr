import "/src/App.css";
import "/src/styles/GameGrid.css";
import { useRef, useState } from "react";
import leftArrow from "../assets/leftArrow.svg";
import rightArrow from "../assets/rightArrow.svg";

function GameGrid(props) {
  function InspectGameACB(gameId) {
    window.location.hash = `#/game/${gameId}`;
  }

  function Carousel({ games }) {
    const carouselRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true); // initially can scroll right

    const maxVisible = 24;
    const limitedGames = games.slice(0, maxVisible);

    const scrollAmount = () => carouselRef.current.offsetWidth;

    const updateScrollButtons = () => {
      const el = carouselRef.current;
      if (!el) return;

      setCanScrollLeft(el.scrollLeft > 0);
      // Account for fractional pixels
      setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 1);
    };

    const scrollLeft = () => {
      carouselRef.current.scrollBy({
        left: -scrollAmount(),
        behavior: "smooth",
      });
    };

    const scrollRight = () => {
      carouselRef.current.scrollBy({
        left: scrollAmount(),
        behavior: "smooth",
      });
    };

    const handleScroll = () => updateScrollButtons();

    return (
      <div
        className="carousel-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && canScrollLeft && (
          <button className="carousel-button left" onClick={scrollLeft}>
            <img
              className="carousel-button__arrow"
              src={leftArrow}
              alt="leftArrow"
            />
          </button>
        )}

        <div className="carousel" ref={carouselRef} onScroll={handleScroll}>
          {limitedGames.map((game) => (
            <div
              className="carousel__game"
              key={game.id}
              onClick={() => InspectGameACB(game.id)}
            >
              <p className="carousel__game-title">{game.title}</p>
              <img
                className="carousel__game-img"
                src={game.image}
                alt={game.title}
              />
            </div>
          ))}
        </div>

        {hovered && canScrollRight && (
          <button className="carousel-button right" onClick={scrollRight}>
            <img
              className="carousel-button__arrow"
              src={rightArrow}
              alt="rightArrow"
            />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* HERO SECTION */}
      <div className="hero">
        {props.trendingGames.slice(0, 1).map((game) => (
          <div
            className="recommended-game"
            onClick={() => InspectGameACB(game.id)}
          >
            <div className="recommended-game__text">
              <p>We think you would like </p>
              <h1>{game.title}</h1>
            </div>
            <img
              className="recommended-game__img"
              key={game.id}
              src={game.image}
              alt={game.title}
            />
          </div>
        ))}

        <div className="shortcuts">
          {props.trendingGames.slice(1, 5).map((game) => (
            <div
              className="shortcuts__container"
              onClick={() => InspectGameACB(game.id)}
            >
              <div className="shortcuts__container-text">
                <h2>{game.title}</h2>
              </div>
              <img
                className="shortcuts__container-img"
                key={game.id}
                src={game.image}
                alt={game.title}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CAROUSELS */}

      <h3>Trending</h3>
      <Carousel games={props.trendingGames} />

      <h3>Recently Released</h3>
      <Carousel games={props.recentlyReleasedGames} />

      <h3>Top Rated</h3>
      <Carousel games={props.topRatedGames} />
    </div>
  );
}

export default GameGrid;
