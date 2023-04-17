import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import PreviewContainer from './PreviewContainer/PreviewContainer';
import QueryPreviewContainer from './BulkEditQueryResults/BulkEditQueryResults';

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
        path="/bulk-edit/:id/preview/query"
        component={QueryPreviewContainer}
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
