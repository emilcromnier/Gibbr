import '/src/App.css';
import '/src/styles/auth.css';
import { useState } from "react";




function Auth(props) {
const [mode, setMode] = useState("login"); // or 'register'
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");

    function submitACB(e) {
    e.preventDefault();
    if (mode === "login") {
      props.onLogin(usernameOrEmail, password);
    } else {
      props.onRegister(username, email, password);
    }
  }

if (props.currentUser) {
  return (
    <div className="auth">
      Welcome, {props.currentUser.username}!{" "}
      <button onClick={props.onLogout}>
        Logout
      </button>
    </div>
  );
}


    

  return(
  
<div className="auth">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={submitACB}>
        {mode === "login" ? (
          <>
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
        <button type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <button className="auth__toggle" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        Switch to {mode === "login" ? "Register" : "Login"}
      </button>
    </div>

  )
  
  
}

export default Auth;