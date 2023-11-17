import { useDispatch, useSelector } from "react-redux";
import { fetchToken } from "../../features/loginslice";
import { useState } from "react";

import { Navigate } from "react-router";
import { selectToken } from "../../utils/selector";

function Signin() {
	const dispatch = useDispatch();
	const [mail, setMail] = useState("");
	const [pass, setPass] = useState("");
	const [remember, setRemember] = useState(false);
	const check = useSelector(selectToken);
	const token = check.token;
	console.log(check);

	const eventHandler = async (e) => {
		e.preventDefault();
		dispatch(fetchToken({ mail, pass, remember }));
	};

	if (token !== 0) {
		return <Navigate to="/user" />;
	}
	return (
		<main className="main bg-dark">
			<section className="sign-in-content">
				<i className="fa fa-user-circle sign-in-icon"></i>
				<h1>Sign In</h1>
				<form>
					<div className="input-wrapper">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id='username'
							onChange={(e) => setMail(e.target.value)}
						/>
					</div>
					<div className="input-wrapper">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							onChange={(e) => setPass(e.target.value)}
						/>
					</div>
					<div className="input-remember">
						<label htmlFor="remember-me">Remember me</label>
						<input
							type="checkbox"
							id="remember-me"
							onClick={() => setRemember(!remember)}
						/>
					</div>

					{check.status === "pending" ? (
						<p>Loading</p>
					) : (
						<button onClick={(e) => eventHandler(e)} className="sign-in-button">
							Sign In
						</button>
					)}
				</form>

				{check.error?.status === 400 ? <p>Wrong username or password </p> : null}
			</section>
		</main>
	);
}

export default Signin;
