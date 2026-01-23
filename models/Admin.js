<!DOCTYPE html>
<html>
<head>
  <title>Admin Login | GyaanBotics</title>
</head>
<body style="background:#0b1220;color:white;text-align:center;padding-top:120px;font-family:sans-serif">

<h2>Admin Login</h2>

<input id="username" placeholder="Username"><br><br>
<input id="password" type="password" placeholder="Password"><br><br>
<button onclick="login()">Login</button>

<script>
const API = "https://gyaanbotics-backend.onrender.com";

async function login() {
  const res = await fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
}
</script>

</body>
</html>
