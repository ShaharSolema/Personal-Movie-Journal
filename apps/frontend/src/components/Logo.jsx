import logo from "../../png/MyLOGO.png";
import {Link} from "react-router";


const Logo = () => {
    return (
        <button className="cursor-pointer">
        
            <Link to="/">
                <img src={logo} alt="Logo" className="w-20 h-20"/>
            </Link>
        </button>
    );
}
export default Logo;
