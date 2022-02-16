import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import PreviewInitial from './PreviewInitial/PreviewInitial';
import PreviewProcessed from './PreviewProcessed/PreviewProcessed';

const BulkEditListResult = ({ fileUpdatedName, updatedId }) => {
  return (
    <Switch>
      <Route
        path="/bulk-edit"
        component={NoResultsMessage}
        exact
      />
      <Route
        path="/bulk-edit/:id/initial"
        component={PreviewInitial}
        exact
      />
      <Route
        path="/bulk-edit/:id/processed"
        component={PreviewProcessed}
        exact
      />
      <Route
        path="/bulk-edit/:id/progress"
        render={() => <ProgressBar title={fileUpdatedName} updatedId={updatedId} />}
      />
    </Switch>
  );
};

export default BulkEditListResult;

BulkEditListResult.propTypes = {
  fileUpdatedName: PropTypes.string,
  updatedId: PropTypes.string,
};
