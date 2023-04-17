const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
require("./config/dbConfig");

const cookieParser = require('cookie-parser');

//with JWT we don´t need sessions
const session = require("express-session");
const MongoStore = require("connect-mongo");

const passport = require("passport");

const viewsRoutes = require("./routers/views.routes");
const apiRoutes = require("./routers/app.routers");

const ChatMongoManager = require("./dao/mongoManager/chatManager.mongoose");
const messages = new ChatMongoManager();

const app = express();
const PORT = process.env.PORT || 8080;

// Listen
const httpServer = app.listen(PORT, () => {
  console.log(`The Server is up and running on port ${httpServer.address().port}`);
});

// SOCKET

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected");
  app.set("socket", socket);

  const getChats = async () => {
    const msg = await messages.getMessages();
    socket.emit("message-logs", msg);
  };

  socket.on("login", async (user) => {
    await getChats();
    socket.emit("welcome", user);
    socket.broadcast.emit("new-user", user);
  });

  socket.on("message", async (data) => {
    await messages.addMessages(data);
    const msg = await messages.getMessages();
    io.emit("message-logs", msg);
  });
});

// Template Engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/../public"));
app.use(cookieParser());

//with JWT we don´t need sessions
app.use(
  session({
    name: "my-session", //Naming the session will set the same name to the cookie
    secret: "top-secret", //protect info with password
    resave: false, //depends on the store method. If value is "true" the session would be active and not expire
    saveUninitialized: false, //store session before it is initialize
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://admin:Data1471@ecommercebackend0.voob3od.mongodb.net/ecommerceBackend0?retryWrites=true&w=majority",
      ttl: 3600,
    }), // once the ttl is complete the session will automatically erased from the mongo atlas
  })
);
app.use(passport.initialize());
app.use(passport.session()); 

// Routes
app.use(viewsRoutes);
app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({
    status: "error",
    error,
  });
});
