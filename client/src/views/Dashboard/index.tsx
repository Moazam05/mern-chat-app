import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import { LuSendHorizonal } from "react-icons/lu";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);

    ws.addEventListener("message", handleMessage);
  }, []);

  const handleMessage = (e: MessageEvent) => {
    console.log("new message", e);
  };

  return (
    <Box className="flex h-screen">
      <Box className="bg-white w-1/3">Contacts</Box>
      <Box className="flex flex-col bg-blue-50 w-2/3 p-2">
        <Box className="flex-grow">Messages with selected person</Box>
        <Box className="flex gap-2 mx-2">
          <PrimaryInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button
            style={{ borderRadius: "5px" }}
            className="bg-blue-500 pr-3 pl-3 text-white flex justify-center items-center"
          >
            <LuSendHorizonal fontSize={25} />
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
