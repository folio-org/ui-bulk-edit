import { renderHook } from '@testing-library/react-hooks';
import { useIntl } from 'react-intl';
import { isEqual, omit } from 'lodash';
import { useMarcApproachValidation, MARC_FORM_INITIAL_STATE, ADMINISTRATIVE_FORM_INITIAL_STATE } from './useMarcApproachValidation';
import {
  getMappedContentUpdates,
  isContentUpdatesFormValid,
} from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { getAdministrativeDataOptions } from '../constants';
import { getTransformedField } from '../components/BulkEditPane/BulkEditListResult/BulkEditMarc/helpers';
import { getMarcFormErrors } from '../components/BulkEditPane/BulkEditListResult/BulkEditMarc/validation';

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

jest.mock('lodash', () => ({
  isEqual: jest.fn(),
  omit: jest.fn(),
}));

jest.mock('../components/BulkEditPane/BulkEditListResult/BulkEditMarc/validation', () => ({
  getMarcFormErrors: jest.fn(),
}));

jest.mock('../components/BulkEditPane/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers', () => ({
  getMappedContentUpdates: jest.fn(),
  isContentUpdatesFormValid: jest.fn(),
}));

jest.mock('../constants', () => ({
  getAdministrativeDataOptions: jest.fn(),
}));

jest.mock('../components/BulkEditPane/BulkEditListResult/BulkEditMarc/helpers', () => ({
  getTransformedField: jest.fn(),
}));

describe('useMarcApproachValidation', () => {
  let formatMessage;

  beforeEach(() => {
    formatMessage = jest.fn();
    useIntl.mockReturnValue({ formatMessage });
    isEqual.mockClear();
    omit.mockClear();
    getMarcFormErrors.mockClear();
    getMappedContentUpdates.mockClear();
    isContentUpdatesFormValid.mockClear();
    getAdministrativeDataOptions.mockClear();
    getTransformedField.mockClear();
  });

  it('should return initial validation states correctly', () => {
    const fields = [{ field: 'value' }];
    const marcFields = [{ tag: '001', ind1: ' ', ind2: ' ', subfield: 'a' }];

    getMarcFormErrors.mockReturnValue({});
    getAdministrativeDataOptions.mockReturnValue(['option1', 'option2']);
    getMappedContentUpdates.mockReturnValue(fields);
    isContentUpdatesFormValid.mockReturnValue(true);
    getTransformedField.mockImplementation(field => ({ ...field, id: 'transformed' }));
    isEqual.mockImplementation((a, b) => JSON.stringify(a) === JSON.stringify(b));
    omit.mockImplementation((item, keys) => {
      const result = { ...item };
      keys.forEach(key => delete result[key]);
      return result;
    });

    const { result } = renderHook(() => useMarcApproachValidation({ fields, marcFields }));

    const expectedMarcContentUpdates = marcFields.map(field => ({ ...field, id: 'transformed' }));
    const expectedMarcContentUpdatesWithoutId = expectedMarcContentUpdates.map(field => omit(field, ['id']));

    expect(result.current).toEqual({
      options: ['option1', 'option2'],
      isMarcFieldsValid: true,
      isMarcFormPristine: !isEqual(MARC_FORM_INITIAL_STATE, expectedMarcContentUpdatesWithoutId),
      isAdministrativeFormValid: true,
      isAdministrativeFormPristine: !isEqual(ADMINISTRATIVE_FORM_INITIAL_STATE, fields),
      contentUpdates: fields,
      marcContentUpdates: expectedMarcContentUpdates,
    });
  });

  it('should return errors and invalid states correctly', () => {
    const fields = [];
    const marcFields = [{ tag: '001', ind1: ' ', ind2: ' ', subfield: 'a' }];

    getMarcFormErrors.mockReturnValue({ tag: 'Required' });
    getAdministrativeDataOptions.mockReturnValue([]);
    getMappedContentUpdates.mockReturnValue(fields);
    isContentUpdatesFormValid.mockReturnValue(false);
    getTransformedField.mockImplementation(field => ({ ...field, id: 'transformed' }));
    isEqual.mockImplementation((a, b) => JSON.stringify(a) === JSON.stringify(b));

    const { result } = renderHook(() => useMarcApproachValidation({ fields, marcFields }));

    expect(result.current).toEqual({
      options: [],
      isMarcFieldsValid: false,
      isMarcFormPristine: !isEqual(MARC_FORM_INITIAL_STATE, marcFields.map(field => omit(field, ['id']))),
      isAdministrativeFormValid: false,
      isAdministrativeFormPristine: !isEqual(ADMINISTRATIVE_FORM_INITIAL_STATE, fields),
      contentUpdates: fields,
      marcContentUpdates: marcFields.map(field => ({ ...field, id: 'transformed' })),
    });
  });
});
