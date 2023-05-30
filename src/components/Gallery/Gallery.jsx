import "./Gallery.css";
import { useMobile } from "../../utils/useMobile";
import { usePortrait } from "../../utils/usePortrait";
import { useSkipDays, useToday, useWord } from "../../utils/CanvasContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Drawing from "../Drawing";
import { getDrawings } from "../../utils/Drawing";

function Gallery({ appRef }) {
  const isMobile = useMobile();
  const isPortrait = usePortrait();
  const word = useWord();
  const today = useToday();
  const skipDays = useSkipDays();
  const galleryRef = useRef();
  const [sort, setSort] = useState("recent");
  const [otherDays, setOtherDays] = useState({
    yesterday: new Date(),
    tomorrow: new Date(),
  });

  const [drawingWidth, drawingHeight] = useMemo(() => [175, 175], []);
  const [sample, setSample] = useState([]);

  const fetchMoreDrawings = useCallback(
    (prev) => {
      const limit = 30;
      getDrawings(today, sort, limit, prev.length).then((res) => {
        setSample([...prev, ...res]);
      });
    },
    [today, sort]
  );

  useEffect(() => {
    fetchMoreDrawings([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, sort]);

  useEffect(() => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    setOtherDays({
      yesterday: yesterday,
      tomorrow: tomorrow,
    });
  }, [today]);

  const onScroll = () => {
    if (galleryRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = galleryRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        fetchMoreDrawings(sample);
      }
    }
  };

  const handleClickScroll = () => {
    if (appRef.current) {
      appRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  return (
    <div className="Gallery" onScroll={onScroll} ref={galleryRef}>
      {isMobile ? (
        isPortrait ? (
          <div />
        ) : (
          <h1 className="Word" style={{ marginBottom: "10px" }}>
            {word}
          </h1>
        )
      ) : (
        <div />
      )}
      <div className="CommandGrid">
        <div
          className="ChangeDate"
          onClick={() => {
            skipDays(-1);
          }}
        >
          <h1>{`< ${
            otherDays.yesterday.getMonth() + 1
          }/${otherDays.yesterday.getDate()}`}</h1>
        </div>
        <div
          className="CommandOption"
          style={sort === "recent" ? { background: "rgb(200, 200, 200)" } : {}}
          onClick={() => {
            setSort("recent");
          }}
        >
          <h1>Recent</h1>
        </div>
        <div
          className="CommandOption"
          style={sort === "likes" ? { background: "rgb(200, 200, 200)" } : {}}
          onClick={() => {
            setSort("likes");
          }}
        >
          <h1>Likes</h1>
        </div>
        <div
          className="ChangeDate"
          onClick={() => {
            skipDays(1);
          }}
        >
          <h1>{`${
            otherDays.tomorrow.getMonth() + 1
          }/${otherDays.tomorrow.getDate()} >`}</h1>
        </div>
      </div>
      <img
        className="ScrollToTop"
        src="https://api.iconify.design/solar:square-alt-arrow-up-linear.svg"
        alt=""
        onClick={() => handleClickScroll()}
      />
      <div
        className="DrawingGrid"
        style={
          isMobile
            ? isPortrait
              ? { gridTemplateColumns: `repeat(1, ${drawingWidth}px)` }
              : { gridTemplateColumns: `repeat(3, ${drawingWidth}px)` }
            : {
                gridTemplateColumns: `repeat(5, ${drawingWidth}px)`,
              }
        }
      >
        {sample ? (
          sample.map((drawing, i) => {
            return (
              <Drawing
                key={i}
                drawing={drawing}
                drawingWidth={drawingWidth}
                drawingHeight={drawingHeight}
              />
            );
          })
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default Gallery;
