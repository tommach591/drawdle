// Once backend is set up, retrieve current daily word.
export function getWord() {
  return fetch(`https://random-word-api.vercel.app/api?words=1&type=uppercase`)
    .then((res) => {
      if (res.ok) return res.json();
      else return;
    })
    .catch((err) => console.error(err));
}
