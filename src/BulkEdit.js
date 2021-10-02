import {
  Switch,
  Route,
} from 'react-router-dom';

const BulkEdit = () => {
  return (
    <Switch>
      <Route path="/bulk-edit">
        <div>Bulk Edit</div>
      </Route>
    </Switch>
  );
};

export default BulkEdit;
