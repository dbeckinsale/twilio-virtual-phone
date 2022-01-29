import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Settings from "./routes/Settings";
import Layout from "./Layout";
import NotFound from "./routes/NotFound";
import Voice from "./routes/Voice";
import Message from "./routes/Message/Message";
import NewConversation from "./routes/Message/NewConversation";
import ChatRoute from "./routes/Message/ChatRoute";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":phone_id">
          <Route path="message" element={<Message />} />
          <Route path="message/new" element={<NewConversation />} />
          <Route path="message/:contact_number" element={<ChatRoute />} />
          <Route path="voice" element={<Voice />} />
        </Route>
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
};

export default App;