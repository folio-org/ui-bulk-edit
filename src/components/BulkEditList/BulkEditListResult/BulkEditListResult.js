import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { ProgressBar } from '../../shared/ProgressBar/ProgressBar';
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
      <Route
        path="/bulk-edit/:id/progress"
        component={ProgressBar}
      />
    </Switch>
  );
};

export default BulkEditListResult;
