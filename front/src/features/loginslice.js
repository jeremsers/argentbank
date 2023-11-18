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
				draft.token = action.payload;

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
				draft.token = 0;
				return;
			}

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
			const err = JSON.parse(error.message);

			dispatch(rejected(err));
		}
	};
}
