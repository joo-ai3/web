<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobile Menu - Soleva</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Cairo', sans-serif;
    }

    body {
      background: #f9f9f9;
      overflow-x: hidden;
    }

    .overlay {
      position: fixed;
      top: 0;
      right: 0;
      width: 100vw;
      height: 100vh;
      backdrop-filter: blur(12px);
      background: rgba(0, 0, 0, 0.4);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.3s ease-in-out forwards;
    }

    .mobile-menu {
      width: 90%;
      max-width: 400px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      box-shadow: 0 0 25px rgba(0,0,0,0.2);
      padding: 20px;
      position: relative;
      animation: slideIn 0.4s ease-in-out forwards;
    }

    .close-btn {
      position: absolute;
      top: 15px;
      left: 15px;
      font-size: 24px;
      background: none;
      border: none;
      cursor: pointer;
      color: #111;
    }

    .menu-item {
      background: rgba(255, 255, 255, 0.6);
      padding: 14px 20px;
      border-radius: 12px;
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: bold;
      color: #000;
      text-decoration: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease-in-out;
    }

    .menu-item:hover {
      background-color: rgba(255, 215, 0, 0.6);
      color: #000;
    }

    .dark .mobile-menu {
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
    }

    .dark .menu-item {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .dark .menu-item:hover {
      background-color: rgba(255, 215, 0, 0.2);
    }

    @keyframes slideIn {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        background: rgba(0, 0, 0, 0);
      }
      to {
        background: rgba(0, 0, 0, 0.4);
      }
    }
  </style>
</head>
<body class="light">

<div class="overlay" id="menuOverlay">
  <div class="mobile-menu">
    <button class="close-btn" onclick="closeMenu()">&times;</button>
    <a href="/" class="menu-item">الرئيسية</a>
    <a href="/collections" class="menu-item">الكوليكشن</a>
    <a href="/favorites" class="menu-item">المفضلة</a>
    <a href="/cart" class="menu-item">السلة</a>
    <a href="/about" class="menu-item">من نحن</a>
    <a href="/contact" class="menu-item">اتصل بنا</a>
  </div>
</div>

<script>
  function closeMenu() {
    document.getElementById("menuOverlay").style.display = "none";
  }

  // auto close on item click
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Theme toggle (optional)
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  }
</script>
</body>
</html>
