import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { memo } from 'react';
import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { Preview } from './Preview/Preview';
import { ProgressBar } from '../../ProgressBar/ProgressBar';

const BulkEditListResult = ({ fileUpdatedName, updatedId }) => {
  return (
    <Switch>
      <Route
        path="/bulk-edit/:id/progress"
        component={() => <ProgressBar title={fileUpdatedName} updatedId={updatedId} />}
      />
      <Route path="/bulk-edit" exact component={NoResultsMessage} />
      <Route
        path="/bulk-edit/:id"
        component={() => <Preview />}
      />
    </Switch>
  );
};

export default BulkEditListResult;

BulkEditListResult.propTypes = {
  fileUpdatedName: PropTypes.string,
  updatedId: PropTypes.string,
};
