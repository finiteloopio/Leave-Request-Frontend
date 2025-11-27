// import React, { useContext } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { AuthContext } from "../context/AuthContext";
// import "./Login.css";

// const Login = () => {
//   const { login } = useContext(AuthContext);

//   const handleSuccess = (credentialResponse) => {
//     // The credentialResponse object contains the idToken
//     console.log(credentialResponse);
//     login(credentialResponse.credential); // 'credential' is the idToken
//   };

//   const handleError = () => {
//     console.log("Login Failed");
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h1>Leave Management System</h1>
//         <p>Please sign in to continue</p>
//         <div className="google-button-wrapper">
//           <GoogleLogin
//             onSuccess={handleSuccess}
//             onError={handleError}
//             useOneTap
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
