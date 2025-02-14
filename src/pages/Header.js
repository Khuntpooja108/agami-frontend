import { Outlet } from "react-router-dom";

function Header({ isLoggedIn, setIsLoggedIn }) {
  const profile=JSON.parse(localStorage.getItem("profile"))
  console.log(profile.name);
  
  return (
    <>
      <header className="sticky top-0 left-0 z-10 bg-white shadow px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-4 ml-auto">
          <button className="text-gray-600">🔔</button>
          <span className="text-gray-700 font-medium">{profile.name}</span>

          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </header>

    </>
  );
}

export default Header;
