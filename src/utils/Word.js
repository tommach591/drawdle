const serverURL = "http://localhost:3001";

export function getWord() {
  return fetch(`${serverURL}/api/word/get`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function postDaily() {
  return fetch(`${serverURL}/api/word/daily`, {
    method: "POST",
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

export function deleteAllWords() {
  return fetch(`${serverURL}/api/word/deleteAll`, {
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
