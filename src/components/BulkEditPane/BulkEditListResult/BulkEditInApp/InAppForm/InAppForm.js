import PropTypes from 'prop-types';

import { Layout, Loading } from '@folio/stripes/components';

import { InAppFormTitle } from './InAppFormTitle';
import { InAppFormBody } from './InAppFormBody';

export const InAppForm = ({
  fields,
  setFields,
  options,
  recordType,
  approach,
  readOnly,
  loading
}) => {
  if (loading) {
    return (
      <Layout className="display-flex centerContent">
        <Loading size="large" />
      </Layout>
    );
  }
  return (
    <>
      <InAppFormTitle
        fields={fields}
      />
      <InAppFormBody
        fields={fields}
        setFields={setFields}
        options={options}
        recordType={recordType}
        approach={approach}
        readOnly={readOnly}
      />
    </>
  );
};

InAppForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFields: PropTypes.func.isRequired,
  options: PropTypes.shape({}).isRequired,
  recordType: PropTypes.string.isRequired,
  approach: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  loading: PropTypes.bool
};
