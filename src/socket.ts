import { Socket } from "socket.io";
import ss from "socket.io-stream";
import fs from "fs";
import { basename } from "path";
import ChatGPTService from "./services/chatgpt.service";
import OpenAI from "openai";
import { Stream } from "stream";

const handleSocket = (socket: Socket) => {
  console.log("a user connected", socket.id);
  const chatgptService = new ChatGPTService();

  const generatePartOfDocument = async (arg, callback) => {
    // console.log({ arg });
    // callback("generate part of document");

    const selectionId = Number(arg.selectionId);
    const partIndex = Number(arg.partIndex);

    try {
      const { stream } = await chatgptService.streamGeneratePartOfDocument(socket, selectionId, partIndex);
      let count = 0;
      for await (const chunk of stream) {
        if (!chunk.choices[0].delta.content) continue;
        socket.emit("get-generate-document-part", chunk.choices[0].delta.content);
        count += 1;
      }
      callback({
        status: "success",
        message: `got it? ${count}`,
      });
    } catch (error) {
      callback({
        status: "error",
        message: error.message,
      });
    } finally {
      callback({
        status: "success",
        message: "finally",
      });
    }

    // console.log("request stream");
    // chatgptService.streamGeneratePartOfDocument(selectionId, partIndex).then(res => {
    //   // for await (const chunk of stream) {
    //   //   socket.emit("get-generate-document-part", chunk.choices[0].delta.content);
    //   // }
    //   // console.log(res);
    //   // callback(res);
    // });
    // callback("got it");

    // const openai = new OpenAI({
    //   apiKey: "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",
    // });

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo-0613",
    //   messages: [
    //     { role: "system", content: "You are a helpful assistant." },
    //     { role: "user", content: "Hello!" },
    //   ],
    //   stream: true,
    // });

    // // console.log("res", completion);
    // for await (const chunk of completion) {
    //   socket.emit("get-generate-document-part", chunk.choices[0].delta.content);
    // }

    // callback("got it");
  };

  // const stream = ss.createStream();
  // const filename = basename("./package.json");
  // ss(socket).emit("get-data", stream, { name: "package.json" });
  // fs.createReadStream(filename, { highWaterMark: 32 }).pipe(stream);

  socket.on("generate-document-part", generatePartOfDocument);
};

export default handleSocket;
