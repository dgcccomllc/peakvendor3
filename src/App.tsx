import React, { useState, useEffect } from 'react';
import { Route, Router } from 'react-router';

import Layout from './components/layout/layout';
import CostView from './components/cost/costview'

import './App.css';
import { routerActions } from 'connected-react-router';

function App() {

  return (
    <Layout>
      <Route path='/:orgId/cost/:costId?' component={CostView}></Route>
    </Layout>
);
}

export default App;
