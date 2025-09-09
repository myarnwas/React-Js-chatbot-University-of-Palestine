import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Chat } from "./components/Chat/Chat";
import { Assistant } from "./components/Assistant/Assistant";
import { Theme } from "./components/Theme/Theme";
import styles from "./App.module.css";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [assistant, setAssistant] = useState();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState();
  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  useEffect(() => {
    handleNewChatCreate();
  }, []);

  function handleAssistantChange(newAssistant) {
    setAssistant(newAssistant);
  }

  function handleChatMessagesUpdate(id, messages) {
    const title = messages[0]?.content.split(" ").slice(0, 7).join(" ");

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id
          ? { ...chat, title: chat.title ?? title, messages }
          : chat
      )
    );
  }

  function handleNewChatCreate() {
    const id = uuidv4();

    setActiveChatId(id);
    setChats((prevChats) => [...prevChats, { id, messages: [] }]);
  }

  function handleActiveChatIdChange(id) {
    setActiveChatId(id);
    setChats((prevChats) =>
      prevChats.filter(({ messages }) => messages.length > 0)
    );
  }

return (
  <div className={styles.App}>
    {/* أيقونة الشات الصغيرة */}
    {!isOpen && (
      <div
        id="chat-icon"
        className={styles.ChatIcon}
        onClick={() => setIsOpen(true)}
      >
        <img src="/chat-bot.png" alt="Chat Bot" />
      </div>
    )}

    {/* نافذة الشات */}
    {isOpen && (
      <div className={styles.ChatBox}>
        {/* الهيدر */}
        <header className={styles.Header}>
            <div className={styles.HeaderContent}>
              <img className={styles.Logo} src="/chat-bot.png" alt="Chat Bot" />
              <h2 className={styles.Title}>University of Palestine Chatbot</h2>
            </div>
            <span className={styles.CloseBtn} onClick={() => setIsOpen(false)}>✖</span>
        </header>


        {/* جسم الشات */}
        <div className={styles.ChatContent}>
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            activeChatMessages={activeChatMessages}
            onActiveChatIdChange={handleActiveChatIdChange}
            onNewChatCreate={handleNewChatCreate}
          />

          <main className={styles.Main}>
            {chats.map((chat) => (
              <Chat
                key={chat.id}
                assistant={assistant}
                isActive={chat.id === activeChatId}
                chatId={chat.id}
                chatMessages={chat.messages}
                onChatMessagesUpdate={handleChatMessagesUpdate}
              />
            ))}

            <div className={styles.Configuration}>
              <Assistant onAssistantChange={handleAssistantChange} />
              <Theme />
            </div>
          </main>
        </div>
      </div>
    )}
  </div>
);

}
export default App;
