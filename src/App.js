import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Datatable from './Datatable';
import UserDetails from './UserDetails';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:id">
          <UserDetails />
        </Route>
        <Route path="/">
          <Datatable />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App;
