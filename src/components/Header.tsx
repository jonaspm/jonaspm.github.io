import HeaderResume from "./HeaderResume";
import HeaderProfile from "./HeaderProfile";
import "@/styles/Header.css";

function Header() {
  return (
    <div className="header max-w-7xl justify-center mt-5">
      <HeaderResume />
      <HeaderProfile />
    </div>
  );
}

export default Header;
