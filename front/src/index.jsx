import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";

import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import store from './utils/Store'
import Home from "./pages/Homepage/Home";
import Login from "./pages/Loginpage/Login";
import Userpage from "./pages/Userpage/Userpage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<Home/>}></Route>
				<Route path="/login" element={<Login/>}></Route>
				<Route path="/user" element={<Userpage/>}></Route>
			</Routes>
		</Router>
	</React.StrictMode>
	</Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
