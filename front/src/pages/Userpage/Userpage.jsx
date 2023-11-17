import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import User from "./User";
import { Navigate} from "react-router";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectToken } from "../../utils/selector";

function Userpage() {

	

	const tokenselect = useSelector(selectToken);
	const token = tokenselect.token;
	
	if (token === 0){
		return  <Navigate to="/" replace = {true} />
	}
	return (
		<>
			<Header />
			<User />
			<Footer />
		</>
	);
}

export default Userpage;
