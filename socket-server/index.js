const { Server } = require("socket.io");
const io = new Server(3001, { cors: { origin: "*" } });

const online = new Map();

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("user:online", (userId) => {
    online.set(userId, socket.id);
    io.emit("presence:update", { userId, status: "online" });
  });

  socket.on("message:send", (msg) => {
    io.emit("message:new", msg);
  });

  socket.on("typing", ({ to, from }) => {
    const sid = online.get(to);
    if (sid) io.to(sid).emit("typing", { from });
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of online.entries()) {
      if (sid === socket.id) {
        online.delete(uid);
        io.emit("presence:update", { userId: uid, status: "offline" });
      }
    }
  });
});

console.log("🔌 Socket server on :3001");
