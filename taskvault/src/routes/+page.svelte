<script lang="ts">
  import { enhance } from "$app/forms";

  export let data: {
    tasks: { id: string; title: string; done: boolean; createdAt: string | Date }[];
    q: string;
    status: string;
  };

  export let form: { ok?: boolean; message?: string } | undefined;
</script>

<h1 style="margin: 0 0 10px;">Mes tâches</h1>

<!-- Filtre / recherche (GET) -->
<form method="GET" style="display:flex;gap:8px;align-items:center;margin:12px 0;">
  <input
    name="q"
    placeholder="Rechercher..."
    value={data.q}
    style="flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;"
  />

  <select
    name="status"
    value={data.status}
    style="padding:10px;border:1px solid #ddd;border-radius:10px;"
  >
    <option value="all">Toutes</option>
    <option value="open">À faire</option>
    <option value="done">Faites</option>
  </select>

  <button style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;cursor:pointer;">
    Filtrer
  </button>
</form>

<!-- Ajout (POST action add) -->
<form
  method="POST"
  action="?/add"
  use:enhance
  style="display:flex;gap:8px;align-items:center;margin:12px 0;"
>
  <input
    name="title"
    placeholder="Nouvelle tâche..."
    style="flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;"
  />
  <button style="padding:10px 14px;border:1px solid #ddd;border-radius:10px;cursor:pointer;">
    Ajouter
  </button>
</form>

<!-- Feedback action -->
{#if form?.message}
  <p
    style="
      margin: 10px 0;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #ddd;
      background: {form.ok ? '#f0fff4' : '#fff5f5'};
    "
  >
    {form.message}
  </p>
{/if}

<!-- Liste -->
{#if data.tasks.length === 0}
  <p style="opacity:.8;margin-top:14px;">
    Aucune tâche. Ajoute-en une ou change les filtres.
  </p>
{:else}
  <ul style="list-style:none;padding:0;display:grid;gap:10px;margin-top:12px;">
    {#each data.tasks as t}
      <li
        style="
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        "
      >
        <!-- Toggle -->
        <form method="POST" action="?/toggle" use:enhance>
          <input type="hidden" name="id" value={t.id} />
          <button
            aria-label="toggle"
            style="padding:8px 10px;border:1px solid #ddd;border-radius:12px;cursor:pointer;"
          >
            {t.done ? "✅" : "⬜"}
          </button>
        </form>

        <!-- Lien détail -->
        <a href={`/tasks/${t.id}`} style="flex:1;text-decoration:none;color:inherit;">
          <div style="display:flex;flex-direction:column;gap:4px;">
            <span style={t.done ? "text-decoration:line-through;opacity:.65;" : ""}>
              {t.title}
            </span>
            <small style="opacity:.65;">
              {new Date(t.createdAt).toLocaleString()}
            </small>
          </div>
        </a>

        <!-- Delete -->
        <form method="POST" action="?/del" use:enhance>
          <input type="hidden" name="id" value={t.id} />
          <button
            aria-label="delete"
            style="padding:8px 10px;border:1px solid #ddd;border-radius:12px;cursor:pointer;"
          >
            🗑️
          </button>
        </form>
      </li>
    {/each}
  </ul>
{/if}
