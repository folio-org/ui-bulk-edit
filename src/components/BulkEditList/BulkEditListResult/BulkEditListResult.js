import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import PreviewContainer from './PreviewContainer/PreviewContainer';

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
        component={PreviewContainer}
        exact
      />
    </Switch>
  );
};

export default BulkEditListResult;
