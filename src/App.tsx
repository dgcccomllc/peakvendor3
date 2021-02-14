import React, { useState, useEffect } from 'react';
import { Route, Router } from 'react-router';

import Layout from './components/layout/layout';
import VendorRequestView from './components/vendor/VendorRequestView'

import './App.css';
import { routerActions } from 'connected-react-router';

function App() {

  return (
    <Layout>
      <Route path='/:orgId/vendor/:vendorId/departure/:departureId' component={VendorRequestView}></Route>
    </Layout>
);
}

export default App;
