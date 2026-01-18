<script lang="ts">
  export let data: { task: { id: string; title: string; done: boolean; createdAt: number } };
</script>

<a href="/tasks">← Retour</a>
<h1>Détail</h1>

<p><b>ID:</b> {data.task.id}</p>
<p><b>Titre:</b> {data.task.title}</p>
<p><b>Statut:</b> {data.task.done ? "Fait" : "À faire"}</p>
<p><b>Créée:</b> {new Date(data.task.createdAt).toLocaleString()}</p>
