<script>

</script>

<template>

<form action="">
    <h2 class="title">Welcome</h2>
    <div class="input-field">
        <span class="material-icons-outlined">E-mail</span>
        <input type="email" placeholder="Email" required />
    </div>
    <div class="input-field">
        <span class="material-icons-outlined">Senha</span>
        <input type="password" class="password" placeholder="Password" required />
    </div>
    <div class="checkbox-text">
        <div class="checkbox-content">
            <input type="checkbox" id="logCheck" />
            <label for="logCheck" class="text">Remember me</label>
        </div>
        <a href="#" class="text">Forgot password?</a>
    </div>
    <div class="input-field button">
        <input type="button" value="Login Now" />
    </div>
    <div class="login-signup">
        <span class="text">Not a member?
            <a href="#" class="text signup-link">Signup now</a>
        </span>
    </div>
</form>
</template>

<style  scoped>
form {
    height: 100%;
    width: fit-content;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    box-sizing: border-box;
    border: 1px solid #000000;
}

</style>