import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import WebSocketProvider from './compoments/elements/ws/ws';

// import css
import './App.css';

// import Page
import ChoicePersonage from './compoments/pages/connection/ChoicePersonage/page';

function App() {
  const [dataPool, setDataPool] = useState(null);
  const [poolId, setPoolId] = useState(null)

  return (
    <WebSocketProvider 
      onPoolId={setPoolId}
    >
      {(sendMessage) => (
        <BrowserRouter>
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
                />
              }
            />
          </Routes>
        </BrowserRouter>
      )}
    </WebSocketProvider>
  );
}

export default App;