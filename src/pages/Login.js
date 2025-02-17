import '../App.css';
import { useState } from 'react';
import axios from 'axios';
import axiosObj from "../config/Axios";


function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password || !email) {
      alert("Both Email and Password are required!");
      return;
    }
    console.log("Sending API request...");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", { email, password }, { validateStatus: () => true });

      console.log("API Response:", response.data);

      if (response.data?.result === 0) {
        alert(response.data.message)
      } else {
        localStorage.setItem("accessToken", response.data.data.accessToken)
        localStorage.setItem("refreshToken", response.data.data.refreshToken)
        console.log("from refreshtoken ",response.data.data.refreshToken);

        alert("Login successful!");
        console.log(response.data);

        console.log("===", response.data.data.accessToken);


        const pf = await axiosObj.get("/auth/profile", { validateStatus: () => true });
        console.log(pf.data.data.profile);
        
        localStorage.setItem("profile",JSON.stringify(pf.data.data.profile))
        
        window.location.href = "/";


      }

    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "Login failed!");

    }


  }

  /* const handleSignIn = () => {
    window.location.href = "http://localhost:3000/auth";
  } */

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="bg-gray-400 p-10 shadow-md w-[500px]">
          <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>

          <form className="mt-4" onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-500 text-white font-bold py-3 mt-2 rounded-lg hover:bg-gray-600 transition"
            >
              Login
            </button>
          </form>

          {/* <div className="text-center mt-4">
            <button className="w-full flex items-center font-bold justify-center gap-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-900 transition"
              onClick={handleSignIn}
            >
              <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google logo" />
              Sign in with Google
            </button>
          </div> */}
        </div>
      </div>


    </>
  );
}

export default Login;
