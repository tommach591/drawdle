import "./Gallery.css";
import { useMobile } from "../../utils/useMobile";
import { usePortrait } from "../../utils/usePortrait";
import { useWord } from "../../utils/CanvasContext";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Drawing from "../Drawing";
import { getDrawings } from "../../utils/Drawing";

function Gallery() {
  const isMobile = useMobile();
  const isPortrait = usePortrait();
  const word = useWord();
  const galleryRef = useRef();
  const [sort, setSort] = useState("recent");

  const [drawingWidth, drawingHeight] = useMemo(() => [175, 175], []);
  const [sample, setSample] = useState([]);

  const fetchMoreDrawings = useCallback(
    (prev) => {
      const limit = 10;
      getDrawings(sort, limit, prev.length).then((res) => {
        setSample([...prev, ...res]);
      });
    },
    [sort]
  );

  useEffect(() => {
    fetchMoreDrawings([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const onScroll = () => {
    if (galleryRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = galleryRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        fetchMoreDrawings(sample);
      }
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
      <div className="SortGrid">
        <div
          className="SortOption"
          style={sort === "recent" ? { background: "rgb(190, 190, 190)" } : {}}
          onClick={() => {
            setSort("recent");
          }}
        >
          <h1>Recent</h1>
        </div>
        <div
          className="SortOption"
          style={sort === "likes" ? { background: "rgb(190, 190, 190)" } : {}}
          onClick={() => {
            setSort("likes");
          }}
        >
          <h1>Likes</h1>
        </div>
      </div>
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
