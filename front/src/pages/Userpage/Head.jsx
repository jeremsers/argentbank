import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { fetchUser, newUsername } from "../../features/userinfo";

import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectUserInfo } from "../../utils/selector";
import { useState } from "react";

function Header() {
	const userinf = useSelector(selectUserInfo);
	const firstName = userinf.firstName;
	const lastName = userinf.lastName;
	const userName = userinf.userName;
	const [editName, setEditName] = useState(userName);
	const [edit, setEdit] = useState(false);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchUser());
	}, [dispatch]);

	function eventHandler(e) {
		e.preventDefault();
		if (editName !== "") {
			dispatch(newUsername(editName));
			setEdit(!edit);
		}
	}
	const userfetch = useSelector(selectUserInfo)

	if (userfetch.status === 'rejected'){
		console.log(`Error ${userfetch.error.status} message ${userfetch.error.message}`)
		return (
			<p>Something went wrong</p>
			)
	}
	if (edit === true) {
		return (
			<div className="header">
				<h1>Edit user info</h1>
				<form id="editform">
					<div className="input-div">
						<label htmlFor="username">User name:</label>
						<input
							id="username"
							name="username"
							placeholder={userName}
							onChange={(e) => setEditName(e.target.value)}
						></input>
					</div>
					<div className="input-div">
						<label htmlFor="firstname">First name:</label>
						<input
							disabled
							id="firstname"
							name="firstname"
							placeholder={firstName}
						></input>
					</div>
					<div className="input-div">
						<label htmlFor="lastname">Last name:</label>
						<input
							disabled
							id="lastname"
							name="lastname"
							placeholder={lastName}
						></input>
					</div>
				</form>
				<div className="button-div">
					<button form="editform" onClick={eventHandler} className="edit-button">
						Save
					</button>

					<button onClick={() => setEdit(!edit)} className="edit-button">
						Cancel
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="header">
			<h1>
				Welcome back
				<br />
				{userName} !
				<br />({firstName} {lastName})
			</h1>
			<button onClick={() => setEdit(!edit)} className="edit-button">
				Edit Name
			</button>
		</div>
	);
}

export default Header;
