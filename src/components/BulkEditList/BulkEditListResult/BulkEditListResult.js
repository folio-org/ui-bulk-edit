import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import PreviewInitial from './PreviewInitial/PreviewInitial';
import PreviewProcessed from './PreviewProcessed/PreviewProcessed';
import { TYPE_OF_PROGRESS } from '../../../constants';

const BulkEditListResult = ({ updatedId, jobId, setCountOfRecords }) => {
  return (
    <Switch>
      <Route
        path="/bulk-edit"
        component={NoResultsMessage}
        exact
      />
      <Route
        path="/bulk-edit/:id/initial"
        render={() => <PreviewInitial setCountOfRecords={setCountOfRecords} />}
        exact
      />
      <Route
        path="/bulk-edit/:id/processed"
        render={() => <PreviewProcessed setCountOfRecords={setCountOfRecords} />}
        exact
      />
      <Route
        path="/bulk-edit/:id/processedProgress"
        render={() => <ProgressBar updatedId={updatedId} typeOfProgress={TYPE_OF_PROGRESS.PROCESSED} />}
      />
      <Route
        path="/bulk-edit/:id/initialProgress"
        render={() => <ProgressBar updatedId={jobId} typeOfProgress={TYPE_OF_PROGRESS.INITIAL} />}
      />
    </Switch>
  );
};

export default BulkEditListResult;

BulkEditListResult.propTypes = {
  updatedId: PropTypes.string,
  jobId: PropTypes.string,
  setCountOfRecords: PropTypes.func,
};
