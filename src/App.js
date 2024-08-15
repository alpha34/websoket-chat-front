import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";
import InputField from "../src/components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("message", (message) => {
      // console.log("message ,  ", message);
      setMessageList((prev) => prev.concat(message));
    });

    askUserName();
  }, []);

  const askUserName = () => {
    const userName = prompt("이름을 입력하세요");
    console.log("사용자 이름 front > ", userName);

    //emint(대화의 제목, 보낼내용, 콜백함수)  - socket에서 말할때! <-> 반대는 on
    socket.emit("login", userName, (res) => {
      if (res.ok) {
        setUser(res.data);
      }
    });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", message, (res) => {
      console.log("sendMessage .. ", res);
    });
  };

  return (
    <div>
      <div className="App">
        <MessageContainer messageList={messageList} user={user} />
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
