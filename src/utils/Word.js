const serverURL = "https://drawdle.herokuapp.com";

export function getWord(date) {
  return fetch(`${serverURL}/api/word/get/${date.toDateString()}`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}

export function postDaily(date) {
  const body = {
    date: date.toDateString(),
  };

  return fetch(`${serverURL}/api/word/daily`, {
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
