import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { Preview } from './Preview/Preview';
import { ProgressBar } from '../../ProgressBar/ProgressBar';

const BulkEditListResult = ({ fileUpdatedName, updatedId }) => {
  return (
    <Switch>
      <Route
        path="/bulk-edit"
        component={NoResultsMessage}
        exact
      />
      <Route
        path="/bulk-edit/:id"
        component={Preview}
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
