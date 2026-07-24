import "./App.css";
import { useSelector } from "react-redux";

import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const role = useSelector((state: any) => state.auth.role);

  const isShopOwner = role === "owner";

  return (
    <div className="app">
      <Topbar />

      <main className="content">
        <AppRoutes />
      </main>

      <Navbar isShopOwner={isShopOwner} />
    </div>
  );
}

export default App;
