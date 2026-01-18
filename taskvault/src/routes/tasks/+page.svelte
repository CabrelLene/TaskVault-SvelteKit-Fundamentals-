<script lang="ts">
  export let data: { tasks: { id: string; title: string; done: boolean; createdAt: number }[] };
  export let form: { message?: string } | undefined;
</script>

<h1>Mes tâches</h1>

<form method="POST" action="?/add" style="display:flex;gap:8px;margin:12px 0;">
  <input name="title" placeholder="Nouvelle tâche..." style="flex:1;" />
  <button>Ajouter</button>
</form>

{#if form?.message}
  <p style="color:red;">{form.message}</p>
{/if}

<ul style="list-style:none;padding:0;display:grid;gap:8px;">
  {#each data.tasks as t}
    <li style="border:1px solid #ddd;padding:10px;border-radius:8px;display:flex;gap:10px;align-items:center;">
      <form method="POST" action="?/toggle">
        <input type="hidden" name="id" value={t.id} />
        <button aria-label="toggle">{t.done ? "✅" : "⬜"}</button>
      </form>

      <a href={`/tasks/${t.id}`} style="flex:1;text-decoration:none;">
        <span style={t.done ? "text-decoration:line-through;opacity:.7;" : ""}>{t.title}</span>
      </a>

      <form method="POST" action="?/del">
        <input type="hidden" name="id" value={t.id} />
        <button aria-label="delete">🗑️</button>
      </form>
    </li>
  {/each}
</ul>
