<template>
  <div class="app-sidebar">
    <div class="logo">Logo</div>
    <nav>
      <ul>
        <li><router-link to="/" exact>Home</router-link></li>
        <li><router-link to="/vista1">Vista 1</router-link></li>
        <li><router-link to="/vista2">Vista 2</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar',
};
</script>


<style>
.app-sidebar {
  width: 200px;
  background-color: #555;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  font-size: 24px;
  margin-bottom: 20px;
  background-color: #ccc;
  color: #000;
  width: 100%;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
}

nav ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

nav ul li {
  margin: 10px 0;
}

nav ul li a {
  display: block;
  padding: 10px;
  background-color: #444;
  text-align: center;
  text-decoration: none;
  color: #fff;
  border-radius: 5px;
}

nav ul li a.router-link-active {
  background-color: #fff;
  color: #000;
}

nav ul li a:hover {
  background-color: #666;
}
</style>