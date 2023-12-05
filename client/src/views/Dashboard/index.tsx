import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import { LuSendHorizonal } from "react-icons/lu";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);

    ws.addEventListener("message", handleMessage);
  }, []);

  const handleMessage = (e: MessageEvent) => {
    const messageData = JSON.parse(e.data);

    if (messageData.type === "onlineUsers") {
      // Use a Set to keep track of unique user IDs
      const uniqueUserIds = new Set();

      // Filter out duplicates based on user IDs
      const uniqueOnlinePeople = messageData.onlineUsers.filter((user: any) => {
        if (!uniqueUserIds.has(user.userId)) {
          uniqueUserIds.add(user.userId);
          return true;
        }
        return false;
      });

      // Set the state with the updated unique array
      setOnlineUsers(uniqueOnlinePeople);
    }
  };

  return (
    <Box className="flex h-screen">
      <Box className="bg-white w-1/3">
        <Box className="text-blue-700 font-bold">Mern Chat</Box>
        {onlineUsers.map((user: any) => (
          // <Box className="flex justify-between items-center p-2 border-b-2">
          //   <Box className="flex gap-2">
          //     <Box className="bg-blue-500 w-10 h-10 rounded-full"></Box>
          //     <Box className="flex flex-col">
          //       <Box className="text-lg">{user.username}</Box>
          //       <Box className="text-sm text-gray-500">{user.userId}</Box>
          //     </Box>
          //   </Box>
          // </Box>
          <Box></Box>
        ))}
      </Box>
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
