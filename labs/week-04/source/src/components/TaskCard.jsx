function TaskCard({ task }) {
  return (
    <article className="panel">
      <h3>{task.title}</h3>

      <p>
        Category: {task.category}
      </p>

      <p>
        Priority: {task.priority}
      </p>

      <p>
        Status: {task.status}
      </p>
    </article>
  );
}
export default TaskCard;