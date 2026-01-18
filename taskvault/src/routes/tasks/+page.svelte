<script lang="ts">
  import { enhance } from "$app/forms";

  export let data: {
    tasks: {
      id: string;
      title: string;
      done: boolean;
      createdAt: string | Date;
      priority: "low" | "normal" | "high";
      dueDate: string | Date | null;
      isDueToday: boolean;
      isOverdue: boolean;
    }[];
    q: string;
    status: string;
    sort: string;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };

  export let form: { ok?: boolean; message?: string } | undefined;

  const pIcon = (p: string) => (p === "high" ? "🔴" : p === "low" ? "🟢" : "🟡");

  function buildPageHref(nextPage: number) {
    const params = new URLSearchParams();
    if (data.q) params.set("q", data.q);
    if (data.status) params.set("status", data.status);
    if (data.sort) params.set("sort", data.sort);
    params.set("page", String(nextPage));
    params.set("limit", String(data.limit));
    return `/tasks?${params.toString()}`;
  }
</script>

<h1 style="margin:0 0 10px;">Mes tâches</h1>

<!-- Filtres -->
<form method="GET" class="row">
  <input name="q" placeholder="Rechercher..." value={data.q} class="input grow" />

  <select name="status" value={data.status} class="input">
    <option value="all">Toutes</option>
    <option value="open">À faire</option>
    <option value="done">Faites</option>
  </select>

  <select name="sort" value={data.sort} class="input">
    <option value="created">Tri: récent</option>
    <option value="due">Tri: échéance</option>
    <option value="priority">Tri: priorité</option>
  </select>

  <select name="limit" value={String(data.limit)} class="input">
    <option value="5">5</option>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="50">50</option>
  </select>

  <button class="btn">Filtrer</button>
</form>

<!-- Ajout -->
<form method="POST" action="?/add" use:enhance class="row">
  <input name="title" placeholder="Nouvelle tâche..." class="input grow" />

  <select name="priority" class="input">
    <option value="high">🔴 Haute</option>
    <option value="normal" selected>🟡 Normale</option>
    <option value="low">🟢 Basse</option>
  </select>

  <input name="dueDate" type="date" class="input" />

  <button class="btn primary">Ajouter</button>
</form>

{#if form?.message}
  <p class="toast {form.ok ? 'ok' : 'bad'}">{form.message}</p>
{/if}

<!-- Pagination meta -->
<div class="meta">
  <small>Total: <b>{data.total}</b> · Page <b>{data.page}</b> / <b>{data.totalPages}</b></small>

  <div class="pager">
    <a class="pill {data.hasPrev ? '' : 'disabled'}" href={buildPageHref(Math.max(1, data.page - 1))}>← Précédent</a>
    <a class="pill {data.hasNext ? '' : 'disabled'}" href={buildPageHref(Math.min(data.totalPages, data.page + 1))}>Suivant →</a>
  </div>
</div>

<!-- Liste -->
{#if data.tasks.length === 0}
  <p class="empty">Aucune tâche.</p>
{:else}
  <ul class="list">
    {#each data.tasks as t}
      <li class="card {t.priority} {t.isOverdue ? 'overdue' : ''}">
        <form method="POST" action="?/toggle" use:enhance>
          <input type="hidden" name="id" value={t.id} />
          <button class="iconbtn" aria-label="toggle">{t.done ? "✅" : "⬜"}</button>
        </form>

        <a class="content" href={`/tasks/${t.id}`}>
          <div class="top">
            <span class="title" style={t.done ? "text-decoration:line-through;opacity:.65;" : ""}>
              {t.title}
            </span>
            <span class="prio">{pIcon(t.priority)} {t.priority}</span>
          </div>

          <div class="bottom">
            {#if t.dueDate}
              <span class="badge {t.isOverdue ? 'bad' : t.isDueToday ? 'warn' : 'neutral'}">
                {t.isOverdue ? "⚠️ En retard" : t.isDueToday ? "⏰ Aujourd’hui" : "📅 " + new Date(t.dueDate).toLocaleDateString()}
              </span>
            {:else}
              <span class="badge neutral">Sans échéance</span>
            {/if}
          </div>
        </a>

        <form method="POST" action="?/del" use:enhance>
          <input type="hidden" name="id" value={t.id} />
          <button class="iconbtn" aria-label="delete">🗑️</button>
        </form>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .row{ display:flex; gap:8px; align-items:center; margin:12px 0; flex-wrap:wrap; }
  .grow{ flex:1; min-width:240px; }

  .input{
    padding:10px 12px;
    border:1px solid #ddd;
    border-radius:12px;
    background:#fff;
  }

  .btn{
    padding:10px 14px;
    border:1px solid #ddd;
    border-radius:12px;
    cursor:pointer;
    background:#fff;
    font-weight:700;
  }
  .btn.primary{ background:#0f2f41; color:#fff; border-color:#0f2f41; }

  .toast{
    margin:10px 0;
    padding:10px 12px;
    border-radius:12px;
    border:1px solid #e5e5e5;
  }
  .toast.ok{ background:#f0fff4; }
  .toast.bad{ background:#fff5f5; }

  .meta{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin:12px 0; opacity:.9; flex-wrap:wrap; }
  .pager{ display:flex; gap:8px; }

  .pill{
    padding:8px 12px;
    border:1px solid #ddd;
    border-radius:999px;
    text-decoration:none;
    color:inherit;
  }
  .pill.disabled{ pointer-events:none; opacity:.4; }

  .list{ list-style:none; padding:0; display:grid; gap:10px; margin-top:12px; }

  .card{
    border:1px solid #ddd;
    border-radius:16px;
    padding:12px;
    display:flex;
    gap:10px;
    align-items:center;
    background:#fff;
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .card:hover{ transform: translateY(-1px); box-shadow:0 12px 30px rgba(0,0,0,.08); }

  /* glow urgent */
  .card.high{
    border-color: rgba(255,0,0,.35);
    box-shadow: 0 0 0 rgba(255,0,0,0);
    animation: glow 2.2s ease-in-out infinite;
  }
  @keyframes glow{
    0%,100%{ box-shadow:0 0 0 rgba(255,0,0,0); }
    50%{ box-shadow:0 0 22px rgba(255,0,0,.25); }
  }
  .card.overdue{ border-color:#ffb3b3; }

  .iconbtn{
    padding:8px 10px;
    border:1px solid #ddd;
    border-radius:12px;
    cursor:pointer;
    background:#fff;
  }

  .content{ flex:1; text-decoration:none; color:inherit; display:flex; flex-direction:column; gap:6px; }
  .top{ display:flex; justify-content:space-between; gap:10px; align-items:center; }
  .title{ font-weight:800; }
  .prio{ opacity:.8; font-size:12px; padding:4px 10px; border:1px solid #eee; border-radius:999px; }

  .badge{
    display:inline-flex;
    align-items:center;
    gap:6px;
    font-size:12px;
    padding:5px 10px;
    border-radius:999px;
    border:1px solid #eee;
  }
  .badge.neutral{ opacity:.75; }
  .badge.warn{ background:#fffbea; border-color:#ffe8a3; }
  .badge.bad{ background:#fff5f5; border-color:#ffcccc; }

  .empty{ opacity:.8; margin-top:14px; }
</style>
