import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import ContactList from "./pages/ContactList";
import ContactDetail from "./pages/ContactDetail";
import NewContact from "./pages/NewContact";
import OrganizationList from "./pages/OrganizationList";
import OrganizationDetail from "./pages/OrganizationDetail";
import MedicineList from "./pages/MedicineList";
import FollowUps from "./pages/FollowUps";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/contacts/new" element={<NewContact />} />
        <Route path="/contacts/:id" element={<ContactDetail />} />
        <Route path="/organizations" element={<OrganizationList />} />
        <Route path="/organizations/:id" element={<OrganizationDetail />} />
        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/follow-ups" element={<FollowUps />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
