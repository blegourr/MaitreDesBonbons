import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import WebSocketProvider from './compoments/elements/ws/ws';

// import css
import './App.css';

// import Page
import ChoicePersonage from './compoments/pages/connection/ChoicePersonage/page';
import Dashboard from './compoments/pages/dashboard/Dashboards';

function App() {
  const [dataPool, setDataPool] = useState(null);
  const [dataParty, setDataParty] = useState(null);
  const [poolId, setPoolId] = useState(null)

  return (
    <BrowserRouter>

      <WebSocketProvider
        onPoolId={setPoolId}
        onDataPool={setDataPool}
        onDataParty={setDataParty}
      >
        {(sendMessage) => (
          <Routes>
            <Route
              path='/'
              exact
              element={
                <ChoicePersonage
                  dataPool={dataPool}
                  onDataPool={setDataPool}
                  sendMessage={sendMessage}
                  poolId={poolId}
                  dataParty={dataParty}
                />
              }
            />
            <Route
              path='/Dashboard'
              exact
              element={
                <Dashboard
                  dataPool={dataPool}
                  onDataPool={setDataPool}
                  sendMessage={sendMessage}
                  poolId={poolId}
                  dataParty={dataParty}
                />
              }
            />
          </Routes>


        )}
      </WebSocketProvider>
    </BrowserRouter>
  );
}

export default App;
