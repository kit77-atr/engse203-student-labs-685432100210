import TaskCard from './TaskCard.jsx';

function TaskList({ tasks }) {
  return (
    <section className="container page-content">

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
        />
      ))}

    </section>
  );
}

export default TaskList;
