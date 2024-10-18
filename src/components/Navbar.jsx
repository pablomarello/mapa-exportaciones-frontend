import { Link } from "react-router-dom";
import logo from "../assets/img/logocat.png";

export const Navbar = ({ isTransparent }) => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center p-1 z-20">
      <div className={`absolute inset-0 bg-azuloscuro ${isTransparent ? 'opacity-100' : 'opacity-60'} z-0`}></div>
      <div className="relative z-10 flex items-center w-full">
        <div className="m-2 text-white">
          <Link to="/">
            <img src={logo} alt="Logo catamarca gobierno" className="w-auto h-12" />
          </Link>
        </div>
      </div>
    </header>
  );
};
