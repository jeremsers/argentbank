import { Link } from "react-router-dom";
import logo from "../assets/img/argentBankLogo.webp";
import Loginbutton from "../Components/Loginbutton";



function Header() {
	

	return (
		<header>
			<nav className="main-nav">
				<Link className="main-nav-logo" to="/">
					<img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
					<h1 className="sr-only">Argent Bank</h1>
				</Link>
				<Loginbutton />
			</nav>
		</header>
	);
}

export default Header;
