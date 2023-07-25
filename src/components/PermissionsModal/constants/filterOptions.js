import { FormattedMessage } from 'react-intl';
import React from 'react';
import { FILTER_KEYS } from './core';

const getOption = (key) => ({
  value: key,
  label: <FormattedMessage id={`ui-bulk-edit.permissionsModal.filter.${key}`} />,
});

export const PERMS_FILTER_OPTIONS = [
  FILTER_KEYS.PERMISSIONS,
  FILTER_KEYS.PERMISSION_SETS,
].map(getOption);

export const STATUS_FILTER_OPTIONS = [
  FILTER_KEYS.ASSIGNED,
  FILTER_KEYS.UNASSIGNED,
].map(getOption);
