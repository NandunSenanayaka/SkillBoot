import React from 'react';
import AppContainer from './components/AppContainer';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppContainer />
    </>
  );
}

export default App;
