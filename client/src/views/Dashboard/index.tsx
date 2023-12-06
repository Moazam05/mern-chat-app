import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import { LuSendHorizonal } from "react-icons/lu";
import { IoMdChatbubbles } from "react-icons/io";
import Avatar from "./components/Avatar";
import useTypedSelector from "../../hooks/useTypedSelector";
import { selectedUserId, selectedUserName } from "../../redux/auth/authSlice";
import { uniqBy } from "lodash";

const Dashboard = () => {
  const userId = useTypedSelector(selectedUserId);
  const userName = useTypedSelector(selectedUserName);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const messageBoxRef = useRef<any>(null);

  // SETTING UP WEBSOCKET CONNECTION
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);

    ws.addEventListener("message", handleMessage);
  }, []);

  const showOnlinePeople = (peopleArray: any) => {
    const people: any = {};
    peopleArray.forEach(({ userId, username }: any) => {
      people[userId] = username;
    });

    const convertedArray = Object.entries(people).map(([userId, username]) => ({
      userId,
      username,
    }));

    setOnlinePeople(convertedArray);
  };

  const handleMessage = (e: MessageEvent) => {
    console.log("e", e);
    // Checking Online People
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
    // Checking New Message
    else if ("text" in messageData) {
      setMessages((prev: any) => [
        ...prev,
        {
          ...messageData,
        },
      ]);
    }
  };

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (ws) {
      ws.send(
        JSON.stringify({
          recipient: selectedUser,
          text: newMessage,
        })
      );
      setNewMessage("");
      setMessages((prev: any) => [
        ...prev,
        {
          text: newMessage,
          sender: userId,
          recipient: selectedUser,
          id: Date.now(),
        },
      ]);
    }
  };
  const messagesWithoutDuplicates = uniqBy(messages, "id");

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messagesWithoutDuplicates]);

  return (
    <Box className="flex h-screen">
      <Box className="bg-white w-1/3">
        <Box className="text-blue-600 font-bold flex items-center p-4 gap-2 text-2xl">
          <IoMdChatbubbles /> Mern Chat {userName}
        </Box>
        {onlinePeople
          .filter((c: any) => c.userId !== userId)
          .map((user: any, index: any) => (
            <Box
              className={
                "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
                (selectedUser === user.userId ? "bg-blue-50" : "")
              }
              onClick={() => setSelectedUser(user.userId)}
              key={index}
            >
              {selectedUser === user.userId && (
                <Box className="w-1 bg-blue-500 h-12 round-r-md"></Box>
              )}
              <Box className="py-2 pl-4 flex gap-2 items-center">
                <Avatar user={user} />
                {user?.username}
              </Box>
            </Box>
          ))}
      </Box>
      <Box className="flex flex-col bg-blue-50 w-2/3 p-2">
        <Box className="flex-grow">
          {!selectedUser && (
            <Box className="flex items-center justify-center h-full text-gray-400">
              &larr; Select a person from the list
            </Box>
          )}

          {!!selectedUser && (
            <Box className="relative h-full">
              <Box
                ref={messageBoxRef}
                className="overflow-y-scroll absolute top-0 bottom-2 right-0 left-0"
              >
                {messagesWithoutDuplicates.map((message: any) => (
                  <Box
                    className={
                      message.sender === userId ? "text-right" : "text-left"
                    }
                  >
                    <Box
                      key={message.id}
                      className={`text-left inline-block p-2 my-2 mr-2 rounded-md text-sm max-w-xs ${
                        message.sender === userId
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {message.text}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        {!!selectedUser && (
          <form className="flex gap-2 mx-2" onSubmit={sendMessage}>
            <PrimaryInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here"
            />
            <button
              type="submit"
              style={{ borderRadius: "5px" }}
              className="bg-blue-500 pr-3 pl-3 text-white flex justify-center items-center"
            >
              <LuSendHorizonal fontSize={25} />
            </button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
