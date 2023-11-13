import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import { QueryClientProvider } from 'react-query';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { queryClient } from '../../../../../../test/jest/utils/queryClient';
import { ValuesColumn } from './ValuesColumn';
import { useLoanTypes, usePatronGroup } from '../../../../../hooks/api';
import { CONTROL_TYPES } from '../../../../../constants';

jest.mock('../../../../../hooks/api/useLoanTypes');
jest.mock('../../../../../hooks/api/usePatronGroup');

const onChange = jest.fn();

const history = createMemoryHistory();

const mockAction = {
  type: '',
  name: 'testName',
  value: 'testValue',
};

const renderComponent = (actionType) => {
  const action = { ...mockAction, controlType: actionType };
  return render(
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en">
          <ValuesColumn action={action} actionIndex={0} onChange={onChange} />
        </IntlProvider>,
      </QueryClientProvider>
    </Router>,
  );
};
describe('ValuesColumn Component', () => {
  beforeEach(() => {
    usePatronGroup.mockReturnValue({
      isLoading: false,
      userGroups: [],
    });

    useLoanTypes.mockReturnValue({
      isLoading: false,
      loanTypes: [],
    });
  });

  afterEach(() => {
    usePatronGroup.mockReset();
    useLoanTypes.mockReset();
  });

  it('should render TextField when action type is INPUT', async () => {
    const { getByTestId } = renderComponent(() => CONTROL_TYPES.INPUT);
    const element = getByTestId('input-email-0');

    expect(element).toBeInTheDocument();

    fireEvent.change(element, { target: { value: 'newTestValue' } });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  /// continue from the above code
  it('should render Select with patron groups when action type is PATRON_GROUP_SELECT', async () => {
    const { getByTestId } = renderComponent(() => CONTROL_TYPES.PATRON_GROUP_SELECT);
    const element = getByTestId('select-patronGroup-0');

    expect(element).toBeInTheDocument();

    fireEvent.change(element, { target: { value: 'newGroup' } });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it('should render Datepicker when action type is DATE', async () => {
    const { getByTestId } = renderComponent(() => CONTROL_TYPES.DATE);
    const element = getByTestId('dataPicker-experation-date-0');

    expect(element).toBeInTheDocument();

    fireEvent.change(element, { target: { value: '2023-06-17' } });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it('should render Select with status options when action type is STATUS_SELECT', async () => {
    const { getByTestId } = renderComponent(() => CONTROL_TYPES.STATUS_SELECT);
    const element = getByTestId('select-statuses-0');

    expect(element).toBeInTheDocument();

    fireEvent.change(element, { target: { value: 'newStatus' } });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it('should render Selection with loan types when action type is LOAN_TYPE', async () => {
    const { container } = renderComponent(() => CONTROL_TYPES.LOAN_TYPE);
    const element = container.querySelector('#loanType');

    expect(element).toBeInTheDocument();

    fireEvent.change(element, { target: { value: 'newLoanType' } });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it('should render select with item note types when action type is LOAN_TYPE', async () => {
    const { container } = renderComponent(() => CONTROL_TYPES.NOTE_SELECT);
    const element = container.querySelector('#noteType');

    expect(element).toBeInTheDocument();

    fireEvent.change(element, { target: { value: 'newLoanType' } });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it('should render select with item note types when action type is DUPLICATE', async () => {
    const { container } = renderComponent(() => CONTROL_TYPES.NOTE_DUPLICATE_SELECT);
    const element = container.querySelector('#noteTypeDuplicate');

    expect(element).toBeInTheDocument();

    fireEvent.change(element, { target: { value: 'CHECK OUT' } });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it('should render select with url relationship types when action type is FIND', async () => {
    const { container } = renderComponent(() => CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT);
    const element = container.querySelector('#urlRelationship');

    expect(element).toBeInTheDocument();

    fireEvent.change(element, { target: { value: 'RESOURCE' } });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });
});
