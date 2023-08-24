import { Socket } from "socket.io";
import ss from "socket.io-stream";
import fs from "fs";
import { basename } from "path";

const handleSocket = (socket: Socket) => {
  console.log("a user connected", socket.id);

  const stream = ss.createStream();
  const filename = basename("./package.json");
  ss(socket).emit("get-data", stream, { name: "package.json" });
  fs.createReadStream(filename, { highWaterMark: 32 }).pipe(stream);
};

export default handleSocket;
