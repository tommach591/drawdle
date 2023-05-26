const serverURL = "http://localhost:3001";

export function getDrawings(limit, offset) {
  return fetch(`${serverURL}/api/drawing/get/${limit}/${offset}`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function saveDrawing(drawHistory) {
  const body = {
    drawHistory: drawHistory,
  };

  return fetch(`${serverURL}/api/drawing/save`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function deleteAllDrawings() {
  return fetch(`${serverURL}/api/drawing/deleteAll`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}
