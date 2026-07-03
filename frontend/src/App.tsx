import { BrowserRouter, Route, Routes } from "react-router-dom";
import ContactList from "./pages/ContactList";
import ContactDetail from "./pages/ContactDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/contacts/:id" element={<ContactDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
