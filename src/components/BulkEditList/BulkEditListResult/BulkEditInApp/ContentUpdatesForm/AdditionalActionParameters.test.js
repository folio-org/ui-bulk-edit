import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AdditionalActionParameters } from './AdditionalActionParameters';
import { ACTIONS, PARAMETERS_KEYS } from '../../../../../constants';
import { ACTION_PARAMETERS_KEY } from './helpers'; // for expect assertions

describe('AdditionalActionParameters', () => {
  const mockAction = {
    actionsList: [
      {
        value: '',
        label: 'Select action',
        disabled: true
      },
      {
        value: ACTIONS.SET_TO_FALSE,
        label: 'Set false',
        disabled: false
      },
      {
        value: ACTIONS.SET_TO_TRUE,
        label: 'Set true',
        disabled: false
      }
    ],
    name: ACTIONS.SET_TO_FALSE,
    value: '',
    parameters: [
      {
        key: PARAMETERS_KEYS.APPLY_TO_ITEMS,
        value: true
      }
    ]
  };

  it('renders checkboxes based on action parameters', () => {
    const { getByLabelText } = render(
      <AdditionalActionParameters action={mockAction} actionIndex={0} onChange={() => {}} />
    );

    expect(getByLabelText(`ui-bulk-edit.layer.action.apply.${PARAMETERS_KEYS.APPLY_TO_ITEMS}`)).toBeInTheDocument();
  });

  it('calls onChange with updated parameters when a checkbox is clicked', () => {
    const mockOnChange = jest.fn();

    const { getByLabelText } = render(
      <AdditionalActionParameters action={mockAction} actionIndex={0} onChange={mockOnChange} />
    );

    fireEvent.click(getByLabelText(`ui-bulk-edit.layer.action.apply.${PARAMETERS_KEYS.APPLY_TO_ITEMS}`));

    expect(mockOnChange).toHaveBeenCalledWith({
      actionIndex: 0,
      value: [{ key: PARAMETERS_KEYS.APPLY_TO_ITEMS, value: false }],
      fieldName: ACTION_PARAMETERS_KEY,
    });
  });
});