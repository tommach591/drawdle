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

  const [drawingWidth, drawingHeight] = useMemo(() => [175, 175], []);
  const [sample, setSample] = useState([]);

  const fetchMoreDrawings = useCallback(() => {
    const limit = 10;
    getDrawings(limit, sample.length).then((res) => {
      setSample([...sample, ...res]);
    });
  }, [sample]);

  useEffect(() => {
    fetchMoreDrawings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    if (galleryRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = galleryRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        fetchMoreDrawings();
      }
    }
  };

  return (
    <div className="Gallery" onScroll={onScroll} ref={galleryRef}>
      {isMobile ? (
        isPortrait ? (
          <div />
        ) : (
          <h1 className="Word">{word}</h1>
        )
      ) : (
        <div />
      )}
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
                drawing={drawing.drawHistory}
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
