import React from "react";

const Logout = props => (
	<form onSubmit = {props.logOut}>		
		<button className="navbtn1">Logout</button>
	</form>
	

);

export default Logout