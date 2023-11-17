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
				// on passe en resolved et on sauvegarde les données

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
				// on passe en pending
				draft.status = "pending";
				return;
			}
			// si le statut est rejected
			if (draft.status === "rejected") {
				// on supprime l'erreur et on passe en pending
				draft.error = null;
				draft.status = "pending";
				return;
			}
			// si le statut est resolved
			if (draft.status === "resolved") {
				// on passe en updating (requête en cours mais des données sont déjà présentent)
				draft.status = "updating";
				return;
			}
			// sinon l'action est ignorée
			return;
		},
		rejected: (draft, action) => {
			// si la requête est en cours
			if (draft.status === "pending" || draft.status === "updating") {
				// on passe en rejected, on sauvegarde l'erreur et on supprime les données
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
			// sinon l'action est ignorée
			return;
		},
	},
});

export const { storeUser,fetching,rejected } = actions;
export default reducer;

export function fetchUser() {
	return async (dispatch, getState) => {
		const status = selectUserInfo(getState()).status
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
			// on stop la fonction pour éviter de récupérer plusieurs fois la même donnée
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
			const err = JSON.parse(error.message)
			dispatch(rejected(err));
		}
	};
}
export function newUsername(action) {
	return async (dispatch, getState) => {
		const status = selectUserInfo(getState()).status
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
			// on stop la fonction pour éviter de récupérer plusieurs fois la même donnée
			return;
		}
		dispatch(fetching());
		try {
			const response = await fetch(
				"http://localhost:3001/api/v1/user/profile",
				bodys
			);
			const temp = await response.json();
			const info = temp.body;
			dispatch(storeUser(info));
			window.localStorage.setItem("username", info.userName);
			sessionStorage.setItem("username", info.userName);
		} catch (error) {
			const err = JSON.parse(error.message)
			dispatch(rejected(err));
		}
	};
}