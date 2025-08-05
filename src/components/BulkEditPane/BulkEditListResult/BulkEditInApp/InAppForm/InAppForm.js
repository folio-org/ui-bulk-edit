import PropTypes from 'prop-types';

import { Layout, Loading } from '@folio/stripes/components';

import { InAppFormTitle } from './InAppFormTitle';
import { InAppFormBody } from './InAppFormBody';

export const InAppForm = ({
  approach,
  disabled,
  fields,
  isNonInteractive,
  loading,
  options,
  recordType,
  setFields,
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
        isNonInteractive={isNonInteractive}
      />
      <InAppFormBody
        approach={approach}
        disabled={disabled}
        fields={fields}
        isNonInteractive={isNonInteractive}
        options={options}
        recordType={recordType}
        setFields={setFields}
      />
    </>
  );
};

InAppForm.propTypes = {
  approach: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isNonInteractive: PropTypes.bool,
  loading: PropTypes.bool,
  options: PropTypes.shape({}).isRequired,
  recordType: PropTypes.string.isRequired,
  setFields: PropTypes.func.isRequired,
};
