<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  export let form: { mode?: "signin" | "signup"; ok?: boolean; message?: string } | undefined;

  let rightPanelActive = false;

  function setMode(mode: "signin" | "signup") {
    rightPanelActive = mode === "signup";
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    goto(url.pathname + url.search, { replaceState: true, keepFocus: true, noScroll: true });
  }

  onMount(() => {
    const url = new URL(window.location.href);
    const mode = (url.searchParams.get("mode") ?? "signin") as "signin" | "signup";
    rightPanelActive = mode === "signup";
  });

  $: if (form?.mode) rightPanelActive = form.mode === "signup";
</script>

<div class="wrap {rightPanelActive ? 'right-panel-active' : ''}">
  <div class="panel panel-signin">
    <h1>Sign In</h1>

    <form method="POST" action="?/signin" use:enhance class="form">
      <input name="email" type="email" placeholder="Email" autocomplete="email" required />
      <input name="password" type="password" placeholder="Password" autocomplete="current-password" required />
      <button class="btn primary">LOGIN</button>
    </form>

    <p class="hint">Or sign in with social platforms</p>
    <div class="social">
      <button type="button" aria-label="facebook">f</button>
      <button type="button" aria-label="twitter">t</button>
      <button type="button" aria-label="google">G</button>
      <button type="button" aria-label="linkedin">in</button>
    </div>

    {#if form?.message && form.mode === "signin"}
      <p class="toast {form.ok ? 'ok' : 'bad'}">{form.message}</p>
    {/if}
  </div>

  <div class="panel panel-signup">
    <h1>Sign Up</h1>

    <form method="POST" action="?/signup" use:enhance class="form">
      <input name="username" placeholder="Username" autocomplete="username" required />
      <input name="email" type="email" placeholder="Email" autocomplete="email" required />
      <input name="password" type="password" placeholder="Password" autocomplete="new-password" required />
      <button class="btn primary">SIGN UP</button>
    </form>

    <p class="hint">Or sign up with social platforms</p>
    <div class="social">
      <button type="button" aria-label="facebook">f</button>
      <button type="button" aria-label="twitter">t</button>
      <button type="button" aria-label="google">G</button>
      <button type="button" aria-label="linkedin">in</button>
    </div>

    {#if form?.message && form.mode === "signup"}
      <p class="toast {form.ok ? 'ok' : 'bad'}">{form.message}</p>
    {/if}
  </div>

  <!-- Overlay (waouh) -->
  <div class="overlay">
    <div class="overlay-content overlay-left">
      <h2>New here ?</h2>
      <p>Crée ton compte et commence à organiser tes tâches comme un pro.</p>
      <button class="btn ghost" type="button" on:click={() => setMode("signup")}>SIGN UP</button>
    </div>

    <div class="overlay-content overlay-right">
      <h2>One of us ?</h2>
      <p>Reviens te connecter. Tes tâches t’attendent.</p>
      <button class="btn ghost" type="button" on:click={() => setMode("signin")}>SIGN IN</button>
    </div>
  </div>
</div>

<style>
  .wrap{
    position:relative;
    width:min(980px, 100%);
    height:560px;
    background:#fff;
    border-radius:24px;
    overflow:hidden;
    box-shadow:0 30px 80px rgba(0,0,0,.25);
  }

  .panel{
    position:absolute;
    top:0;
    width:50%;
    height:100%;
    padding:64px 48px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:12px;
    transition: transform .75s cubic-bezier(.2,.9,.2,1), opacity .6s ease;
  }

  .panel h1{ margin:0 0 8px; font-size:44px; letter-spacing:-1px; }
  .hint{ margin:8px 0 0; opacity:.75; font-size:14px; }
  .form{ display:flex; flex-direction:column; gap:12px; margin-top:8px; }

  input{
    border:none;
    background:#f2f2f2;
    padding:14px 16px;
    border-radius:999px;
    outline:none;
    font-size:14px;
  }

  .btn{
    border:none;
    border-radius:999px;
    padding:14px 18px;
    cursor:pointer;
    font-weight:700;
    letter-spacing:.4px;
  }
  .btn.primary{
    background:#0f2f41;
    color:#fff;
    margin-top:6px;
  }
  .btn.ghost{
    background:transparent;
    color:#fff;
    border:2px solid rgba(255,255,255,.85);
  }

  .social{ display:flex; gap:10px; margin-top:6px; }
  .social button{
    width:40px;height:40px;border-radius:999px;
    border:1px solid #d8d8d8;
    background:#fff;
    cursor:pointer;
    font-weight:800;
  }

  .toast{
    margin-top:14px;
    padding:10px 12px;
    border-radius:12px;
    border:1px solid #e5e5e5;
    font-size:14px;
  }
  .toast.ok{ background:#f0fff4; }
  .toast.bad{ background:#fff5f5; }

  /* Signin left, Signup right */
  .panel-signin{ left:0; }
  .panel-signup{ right:0; opacity:0; transform: translateX(40px); }

  .overlay{
    position:absolute;
    top:0;
    left:50%;
    width:50%;
    height:100%;
    background: radial-gradient(900px 700px at 15% 50%, #78aeca 0%, #0f2f41 60%, #0a1e2a 100%);
    transition: transform .75s cubic-bezier(.2,.9,.2,1);
    border-top-left-radius:180px;
    border-bottom-left-radius:180px;
  }

  .overlay-content{
    position:absolute;
    inset:0;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:12px;
    padding:64px 56px;
    color:#fff;
    transition: transform .75s cubic-bezier(.2,.9,.2,1), opacity .6s ease;
  }

  .overlay-content h2{ margin:0; font-size:38px; }
  .overlay-content p{ margin:0; opacity:.9; max-width:320px; }

  .overlay-left{ opacity:0; transform: translateX(-30px); }
  .overlay-right{ opacity:1; transform: translateX(0); }

  /* ACTIVE: show signup, move overlay left */
  .right-panel-active .overlay{ transform: translateX(-100%); }
  .right-panel-active .panel-signin{ transform: translateX(40px); opacity:0; }
  .right-panel-active .panel-signup{ opacity:1; transform: translateX(0); }
  .right-panel-active .overlay-left{ opacity:1; transform: translateX(0); }
  .right-panel-active .overlay-right{ opacity:0; transform: translateX(30px); }

  /* Mobile: même concept mais vertical */
  @media (max-width: 900px){
    .wrap{ height:auto; border-radius:22px; }
    .panel{
      position:relative;
      width:100%;
      padding:34px 22px;
      transform:none !important;
      opacity:1 !important;
    }
    .overlay{
      position:relative;
      left:auto;
      width:100%;
      height:auto;
      border-radius:18px;
      margin:10px 14px 18px;
      overflow:hidden;
      transform:none !important;
    }
    .overlay-content{ position:relative; padding:28px 22px; }
    .overlay-left, .overlay-right{ opacity:1; transform:none; }
    .right-panel-active .overlay{ }
    /* On affiche les deux, mais on “guide” avec le bouton */
    .panel-signup{ display: {rightPanelActive ? "block" : "none"}; }
  }
</style>
