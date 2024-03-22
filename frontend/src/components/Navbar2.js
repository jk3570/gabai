//CSS
import "../css/nav.css";

//AuthContext provider
import { useAuthContext } from "../hooks/useAuthContext";
import Profile from "./Profile";
import { useState, useEffect } from "react";

//Images and Icons
import { Link } from "react-router-dom";
import Logo from "../img/Logo.png";
import iconAzure from "../img/iconAzure.svg";
import { BsMoon } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";

// Components
import Login from "./Login";
import Sidebar from "../components/admin/Sidebar.js";

const toggle = () => {
    var element = document.body;
    element.classList.toggle("dark-mode");
  };




function Navbar2() {
  const { user, dispatch } = useAuthContext();
  const location = useLocation();
return (
  <>
    <nav className="fixed top-0 z-40 bg-white pl-[4rem] h-[3.875rem] w-full p-[1rem] font-bold border-b-2 border-azure-500">
      <div className="w-full flex justify-between items-center">
        <div className="flex justify-center items-center gap-2">
        
        {/* Brand Logo */}
        <button class="group relative z-0 font-bold flex justify-center gap-2 items-center">
          <img src={iconAzure} alt="Logo" class="" style={{ height: "30px" }} />
              <span class="inline-flex  text-azure-500 transform text-3xl font-bold pt-1">
                GabAi
              </span>
        </button>
        </div>
        <div className="flex flex-row items-center text-md gap-x-5">
            {/* Search Icon */}
            <Link to="/search">
              <FaSearch className="text-2xl hover:scale-[1.1] transition-all duration-200 ease-in-out" />
            </Link>

            {/* Toggle night mode */}
            <BsMoon
              className="text-2xl hover:scale-[1.1] transition-all duration-200 ease-in-out"
              onClick={toggle}
            />

            {/* Profile Btn */}
            <Profile />
        </div>
      </div>
    </nav>
  </>
    );
}

export default Navbar2;