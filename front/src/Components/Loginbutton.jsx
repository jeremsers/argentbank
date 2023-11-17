import { Link } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectToken, selectUserInfo } from "../utils/selector";
import { useDispatch } from "react-redux";
import {updateToken} from "../features/loginslice"

function Loginbutton() {
	const tokenselect = useSelector(selectToken);
	const userselect = useSelector(selectUserInfo);
	const token = tokenselect.token;
	console.log(token);
	const dispatch = useDispatch();
	const username = userselect.userName;

	function logoutHandler() {
		window.localStorage.removeItem("token");
		window.localStorage.removeItem("username");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("username");
		dispatch(updateToken(0));
		window.reload();
	}

	if (token !== 0) {
		return (
			<div className="main-nav-container">
				<Link to="/user" className="main-nav-item">
					<i className="fa fa-user-circle"></i>
					{username}
				</Link>
				<Link to="/" onClick={logoutHandler} className="main-nav-item">
					<i className="fa-solid fa-arrow-right-from-bracket"></i>
					Sign Out
				</Link>
			</div>
		);
	}

	return (
		<div>
			<Link to="/login" className="main-nav-item">
				<i className="fa fa-user-circle"></i>
				Sign In
			</Link>
		</div>
	);
}

export default Loginbutton;
