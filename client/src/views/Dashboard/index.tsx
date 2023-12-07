// React Imports
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// MUI Imports
import { Box } from "@mui/material";
// React Icons
import { LuSendHorizonal } from "react-icons/lu";
import { IoMdChatbubbles } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BiLogOutCircle } from "react-icons/bi";
// Hooks
import useTypedSelector from "../../hooks/useTypedSelector";
// Redux
import { selectedUserId, selectedUserName } from "../../redux/auth/authSlice";
import { useGetUserQuery } from "../../redux/api/userApiSlice";
import { useGetMessagesQuery } from "../../redux/api/messageApiSlice";
// Lodash
import { uniqBy } from "lodash";
// React Cookies
import { Cookies } from "react-cookie";
// Utils
import { formatDateTime } from "../../utils";
// Custom Imports
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import Avatar from "./components/Avatar";
import OverlayLoader from "../../components/Spinner/OverlayLoader";
import { SubHeading } from "../../components/Heading";

const Dashboard = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const messageBoxRef = useRef<any>(null);

  const userId = useTypedSelector(selectedUserId);
  const userName = useTypedSelector(selectedUserName);

  // States
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<any>([]);
  const [offlinePeople, setOfflinePeople] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);

  // SETTING UP WEBSOCKET CONNECTION
  useEffect(() => {
    connectToWebsocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectToWebsocket = () => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);

    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () =>
      setTimeout(() => {
        console.log("Disconnected, Trying to reconnect...");
        connectToWebsocket();
      }, 1000)
    );
  };

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
    // console.log("e", e);
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

  // GETTING MESSAGES API QUERY
  const { data } = useGetMessagesQuery(selectedUser || "", {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      setMessages(data?.messages);
    }
  }, [data]);

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
          _id: Date.now(),
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };
  const messagesWithoutDuplicates = uniqBy(messages, "_id");

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // GETTING ALL USERS API QUERY
  const { data: allUsers, isLoading } = useGetUserQuery({
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (allUsers) {
      // Exclude the current user and logged-in user
      const excludeMe = allUsers?.data?.filter(
        (user: any) => user.userId !== userId
      );
      // Filter users who are offline
      const offlineUsers = excludeMe?.filter(
        (user: any) =>
          !onlinePeople?.some(
            (onlineUser: any) => onlineUser.userId === user.userId
          )
      );

      setOfflinePeople(offlineUsers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsers, onlinePeople]);

  return (
    <Box className="flex h-screen">
      {isLoading && <OverlayLoader />}
      <Box className="bg-white w-1/3 flex flex-col">
        <Box className="flex-grow">
          <Box className="flex items-center justify-between">
            <Box className="text-blue-500 font-bold flex items-center p-4 gap-2 text-2xl">
              <IoMdChatbubbles /> Chat HuB
            </Box>
            <Box className="pr-4">
              <SubHeading
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CgProfile /> {userName}
              </SubHeading>
            </Box>
          </Box>
          {/* Online People */}
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
                  <Avatar online={true} user={user} />
                  {user?.username}
                </Box>
              </Box>
            ))}
          {/* Offline People */}
          {offlinePeople.map((user: any, index: any) => (
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
                <Avatar online={false} user={user} />
                {user?.username}
              </Box>
            </Box>
          ))}
        </Box>
        <Box className="p-2 text-center">
          <Box className="flex items-center pb-2 gap-2">
            <button
              className="text-sm text-gray-600 bg-blue-100 py-1 px-2 border rounded-sm flex items-center gap-2"
              onClick={() => {
                localStorage.removeItem("user");
                cookies.remove("user");
                navigate("/login");
              }}
            >
              <BiLogOutCircle />
              Logout
            </button>
          </Box>
        </Box>
      </Box>
      <Box className="flex flex-col bg-blue-50 w-2/3 p-2 pt-4">
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
                {messagesWithoutDuplicates.map(
                  (message: any, index: number) => {
                    const currentMessageDate = new Date(message.createdAt);
                    const previousMessage: any =
                      messagesWithoutDuplicates[index - 1];

                    const isSameMinute =
                      index > 0 &&
                      previousMessage &&
                      new Date(previousMessage.createdAt).getMinutes() ===
                        currentMessageDate.getMinutes();
                    return (
                      <Box
                        key={message._id}
                        className={
                          message.sender === userId ? "text-right" : "text-left"
                        }
                      >
                        {!isSameMinute && (
                          <Box className="flex items-center justify-center text-sm text-gray-500">
                            {formatDateTime(message.createdAt)}
                          </Box>
                        )}
                        <Box
                          className={`text-left inline-block p-2 my-2 mr-2 rounded-md text-sm max-w-xs ${
                            message.sender === userId
                              ? "bg-blue-500 text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          {message.text}
                        </Box>
                      </Box>
                    );
                  }
                )}
              </Box>
            </Box>
          )}
        </Box>
        {!!selectedUser && (
          <form className="flex gap-2 mr-6" onSubmit={sendMessage}>
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
