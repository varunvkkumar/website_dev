<?php
session_start();

// Load the existing users
$users = json_decode(file_get_contents('users.json'), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Check if the username or email already exists
    foreach ($users as $user) {
        if ($user['username'] === $username || $user['email'] === $email) {
            echo "Username or email already exists.";
            exit();
        }
    }

    // Add new user to the users array
    $users[] = [
        'username' => $username,
        'email' => $email,
        'password' => $password
    ];

    // Save the users array back to the JSON file
    file_put_contents('users.json', json_encode($users));

    $_SESSION['username'] = $username;
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
</head>
<body>
    <form method="POST" action="">
        <input type="text" name="username" placeholder="Username" required><br>
        <input type="email" name="email" placeholder="Email" required><br>
        <input type="password" name="password" placeholder="Password" required><br>
        <button type="submit">Register</button>
    </form>
</body>
</html>
