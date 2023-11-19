import { createSlice } from "@reduxjs/toolkit";
import { selectUserInfo } from "../utils/selector";

const initialState = {
	status: "void",
	firstName: "",
	lastName: "",
	userName:
		window.localStorage.getItem("username") ||
		sessionStorage.getItem("username") ||
		"",
	error: null,
};

export const { actions, reducer } = createSlice({
	name: "userinfo",
	initialState,
	reducers: {
		storeUser: (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.firstName = action.payload.firstName;
				draft.lastName = action.payload.lastName;
				draft.userName = action.payload.userName;
				draft.status = "resolved";
				return;
			}
			return;
		},
		fetching: (draft) => {
			if (draft.status === "void") {
				draft.status = "pending";
				return;
			}

			if (draft.status === "rejected") {
				draft.error = null;
				draft.status = "pending";
				return;
			}

			if (draft.status === "resolved") {
				draft.status = "updating";
				return;
			}

			return;
		},
		rejected: (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.status = "rejected";
				draft.error = action.payload;
				draft.firstName = "";
				draft.lastName = "";
				draft.userName =
					window.localStorage.getItem("username") ||
					sessionStorage.getItem("username") ||
					"";
				return;
			}

			return;
		},
	},
});

export const { storeUser, fetching, rejected } = actions;
export default reducer;

export function fetchUser() {
	return async (dispatch, getState) => {
		const status = selectUserInfo(getState()).status;
		const token = getState().log.token;
		const auth = `Bearer ${token}`;
		const bodys = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: auth,
			},
		};
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(fetching());
		try {
			const response = await fetch(
				"http://localhost:3001/api/v1/user/profile",
				bodys
			);
			const temp = await response.json();
			if (temp.status !== 200) {
				throw new Error(JSON.stringify(temp));
			}
			const info = temp.body;
			dispatch(storeUser(info));
			window.localStorage.setItem("username", info.userName);
			sessionStorage.setItem("username", info.userName);
		} catch (error) {
			const err = JSON.parse(error.message);
			dispatch(rejected(err));
		}
	};
}
export function newUsername(action) {
	return async (dispatch, getState) => {
		const status = selectUserInfo(getState()).status;
		const payloadbody = { userName: action };
		console.log(payloadbody);
		const token = getState().log.token;
		const auth = `Bearer ${token}`;
		const bodys = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: auth,
			},
			body: JSON.stringify(payloadbody),
		};
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(fetching());
		try {
			const response = await fetch(
				"http://localhost:3001/api/v1/user/profile",
				bodys
			);
			const temp = await response.json();
			if (temp.status !== 200) {
				throw new Error(JSON.stringify(temp));
			}
			const info = temp.body;
			dispatch(storeUser(info));
			window.localStorage.setItem("username", info.userName);
			sessionStorage.setItem("username", info.userName);
		} catch (error) {
			const err = JSON.parse(error.message);
			dispatch(rejected(err));
		}
	};
}
