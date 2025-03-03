import { Switch, Route } from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { PreviewLayout } from './PreviewLayout/PreviewLayout';


const BulkEditListResult = () => {
  return (
    <Switch>
      <Route
        path="/bulk-edit"
        component={NoResultsMessage}
        exact
      />
      <Route
        path="/bulk-edit/:id/preview"
        component={PreviewLayout}
        exact
      />
    </Switch>
  );
};

export default BulkEditListResult;
