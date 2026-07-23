import { initialTasks } from './data/initialTasks.js';

import AppHeader from './components/AppHeader.jsx';

import SummaryPanel from './components/SummaryPanel.jsx';


function App() {

  return (
    <>

      <AppHeader />


      <main className="container page-content">

        <SummaryPanel 
          count={initialTasks.length}
        />

      </main>


    </>
  );
}


export default App;