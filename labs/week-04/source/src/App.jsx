import { useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import RequestForm from './components/RequestForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import RequestList from './components/RequestList.jsx';
import { initialRequests } from './data/initialRequests.js';

function App() {
  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = {
    total: requests.length,
    pending: requests.filter((request) => request.status === 'pending').length,
    inProgress: requests.filter((request) => request.status === 'in-progress').length,
    completed: requests.filter((request) => request.status === 'completed').length,
  };

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter((request) => request.status === statusFilter);

  function handleAddRequest(requestData) {
    const nextNum = requests.reduce((max, r) => {
      const num = parseInt(r.id.replace('REQ-', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0) + 1;
    const newId = `REQ-${String(nextNum).padStart(3, '0')}`;
    const newRequest = {
      id: newId,
      ...requestData,
      status: 'pending',
    };
    setRequests([newRequest, ...requests]);
  }

  function handleDeleteRequest(requestId) {
    setRequests(requests.filter((request) => request.id !== requestId));
  }

  return (
    <>
      <AppHeader
        title="Campus Service Request"
        subtitle="ระบบแจ้งคำร้องบริการภายในวิทยาเขต (React Component-based Application)"
      />
      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <div className="workspace-grid">
          <RequestForm onAddRequest={handleAddRequest} />
          <section className="panel" aria-labelledby="request-list-title">
            <div className="section-heading">
              <h2 id="request-list-title">รายการคำร้อง</h2>
              <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
            </div>
            <RequestList
              requests={filteredRequests}
              onDeleteRequest={handleDeleteRequest}
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;

