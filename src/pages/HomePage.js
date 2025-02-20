import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="">
      <p>Welcome to the Employee Management System.</p>
    </div>
  );
}
export default HomePage