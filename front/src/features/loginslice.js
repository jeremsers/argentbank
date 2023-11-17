import { createSlice } from "@reduxjs/toolkit";
import { selectToken } from "../utils/selector";

const initialState = {
	status: "void",
	token:
		window.localStorage.getItem("token") || sessionStorage.getItem("token") || 0,
	error: null,
};

export const { actions, reducer } = createSlice({
	name: "logintoken",
	initialState,
	reducers: {
		updateToken: (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				// on passe en resolved et on sauvegarde les données
				draft.token = action.payload;

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
				draft.token = 0;
				return;
			}
			// sinon l'action est ignorée
			return;
		},
	},
});

export const { updateToken, fetching, rejected } = actions;

export default reducer;

export function fetchToken(pl) {
	return async (dispatch, getState) => {
		const status = selectToken(getState()).status;
		const payloadbody = { email: pl.mail, password: pl.pass };
		console.log(payloadbody);
		const bodys = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
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
				"http://localhost:3001/api/v1/user/login",
				bodys
			);
			const temp = await response.json();
			if (temp.status !== 200) {
				
				throw new Error(JSON.stringify(temp));
			}
			const tok = temp.body.token;
			sessionStorage.setItem("token", tok);
			if (pl.remember) {
				window.localStorage.setItem("token", tok);
			}

			dispatch(updateToken(tok));
		} catch (error) {
			
			const err = JSON.parse(error.message)
			
			dispatch(rejected(err));
		}
	};
}
