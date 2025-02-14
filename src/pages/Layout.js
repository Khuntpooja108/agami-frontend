import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";

function Layout() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(()=>{

    if(isLoggedIn!==true){
      localStorage.removeItem("accessToken");
      localStorage.removeItem("profile");
      window.location.href="/login"
    }
  },[isLoggedIn])
  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
