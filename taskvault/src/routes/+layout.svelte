<script lang="ts">
  export let data: { user: { id: string; email: string } | null };
</script>

<nav style="display:flex;gap:12px;align-items:center;padding:12px;border-bottom:1px solid #ddd;">
  <a href="/tasks">Tasks</a>
  <span style="margin-left:auto;">
    {#if data.user}
      {data.user.email} · <a href="/logout">Logout</a>
    {/if}
  </span>
</nav>

<main style="max-width:900px;margin:0 auto;padding:16px;">
  <slot />
</main>
