<script lang="ts">
  export let data: any;
  export let form: { message?: string } | undefined;
</script>

<h1>Login</h1>

<form method="POST" style="display:flex;gap:8px;align-items:center;">
  <input name="email" placeholder="demo@taskvault.com" />
  <button>Se connecter</button>
</form>

{#if form?.message}
  <p style="color:red;">{form.message}</p>
{/if}

<p style="margin-top:12px;opacity:.8;">Compte demo: <code>demo@taskvault.com</code></p>
