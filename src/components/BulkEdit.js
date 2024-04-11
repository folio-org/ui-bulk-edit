import {
  Switch,
  Route,
} from 'react-router-dom';
import { BulkEditPane } from './BulkEditPane/BulkEditPane';

const BulkEdit = () => {
  return (
    <Switch>
      <Route
        path="/bulk-edit"
        component={BulkEditPane}
      />
    </Switch>
  );
};

export default BulkEdit;
