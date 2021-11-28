import {
  Switch,
  Route,
} from 'react-router-dom';

import { BulkEditListContainter } from './BulkEditList/BulkEditListContainer';

const BulkEdit = () => {
  return (
    <Switch>
      <Route
        path="/bulk-edit"
        component={BulkEditListContainter}
      />
    </Switch>
  );
};

export default BulkEdit;
