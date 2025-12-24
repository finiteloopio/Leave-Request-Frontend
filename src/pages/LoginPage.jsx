// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { msalInstance } from "../auth/msalConfig";

// const LoginPage = ({ onLoginSuccess }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initMsal = async () => {
//       try {
//         await msalInstance.initialize();
//         console.log("✅ MSAL initialized successfully");
//       } catch (err) {
//         console.error("❌ MSAL initialization failed:", err);
//       }
//     };
//     initMsal();
//   }, []);

//   const handleMicrosoftLogin = async () => {
//     try {
//       // Step 1: Microsoft popup login
//       const loginResponse = await msalInstance.loginPopup({
//         scopes: ["openid", "profile", "email", "User.Read"],
//       });

//       console.log("✅ Microsoft Login Success:", loginResponse);
//       const idToken = loginResponse.idToken;

//       // Step 2: Send token to backend for verification
//       const response = await fetch("http://localhost:5001/api/auth/login/microsoft", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ idToken }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Login failed");
//       }

//       const data = await response.json();
//       console.log("✅ Backend response:", data);

//       if (data.token && data.user) {
//         // Step 3: Call callback to update AuthContext
//         onLoginSuccess(data.user, data.token);
        
//         // Step 4: Navigate to dashboard
//         console.log("🔹 User role:", data.user.role);
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       console.error("❌ Login error:", error);
//       alert(`Login failed: ${error.message}`);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h2>Login with Microsoft</h2>
//       <button 
//         onClick={handleMicrosoftLogin}
//         style={{
//           padding: "12px 24px",
//           fontSize: "16px",
//           cursor: "pointer",
//           backgroundColor: "#0078d4",
//           color: "white",
//           border: "none",
//           borderRadius: "4px",
//           fontWeight: "500"
//         }}
//       >
//         Sign in with Microsoft
//       </button>
//     </div>
//   );
// };

// export default LoginPage;
import React from "react";

const LoginPage = () => {
  const handleMicrosoftLogin = () => {
    window.location.href =
      "https://leave-request-backend-ju8h.onrender.com/api/auth/login/microsoft";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login with Microsoft</h2>
      <button onClick={handleMicrosoftLogin}>
        Sign in with Microsoft
      </button>
    </div>
  );
};

export default LoginPage;
