import express from "express";
import cors from "cors";

const userList = [];
const tweetList = [];

const app = express();
app.use(express.json());
app.use(cors());

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;
  if (!username || !avatar) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  userList.push({ username, avatar });
  res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
  const { tweet } = req.body;
  const { user: username } = req.headers;

  if (!tweet || !username) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  const userFinded = userList.find((user) => user.username === username);
  const avatar = userFinded.avatar;
  tweetList.push({ username, tweet, avatar });
  res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
  const page = Number(req.query.page);

  if (page <= 0) {
    return res.status(400).send("Informe uma página válida!");
  }

  if (page === undefined || page === 1) {
    return res.send(tweetList.slice(-10).reverse());
  }

  const start = page * -10;
  const end = (page - 1) * -10;
  res.send(tweetList.slice(start, end).reverse());
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const userTweets = tweetList.filter((tweet) => tweet.username === username);
  res.send(userTweets.reverse());
});

app.listen(5000);
