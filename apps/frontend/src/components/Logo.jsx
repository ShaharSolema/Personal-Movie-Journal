import logo from "../../png/MyLOGO.png";


const Logo = () => {
    return (
        <button
            className="cursor-pointer"
            onClick={() => {
                window.location.href = "/";
            }}
        >
            <img src={logo} alt="Logo" className="w-20 h-20"/>
        </button>
    );
}
export default Logo;
