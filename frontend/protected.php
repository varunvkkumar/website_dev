<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Protected Resources</title>
</head>
<body>
    <h1>Welcome, <?php echo $_SESSION['username']; ?>!</h1>
    <p>Here are the software downloads available to you:</p>
    <ul>
        <li><a href="downloads/test_software.xlsx" download>Software 1</a></li>
    </ul>
    <a href="logout.php">Logout</a>
</body>
</html>
