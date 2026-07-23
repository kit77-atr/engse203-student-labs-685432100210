import { useState } from 'react';

import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import TaskList from './components/TaskList.jsx';

import { initialTasks } from './data/initialTasks.js';


function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const [statusFilter, setStatusFilter] = useState('all');


  const filteredTasks =
    statusFilter === 'all'
      ? tasks
      : tasks.filter(
          (task) => task.status === statusFilter
        );


  return (
    <>
      <AppHeader />

      <SummaryPanel />

      <div>
        <button onClick={() => setStatusFilter('all')}>
          All
        </button>

        <button onClick={() => setStatusFilter('todo')}>
          Todo
        </button>

        <button onClick={() => setStatusFilter('doing')}>
          Doing
        </button>

        <button onClick={() => setStatusFilter('done')}>
          Done
        </button>
      </div>

      <TaskList tasks={filteredTasks} />
    </>
  );
}

export default App;