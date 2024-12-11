import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import {
  render,
  waitFor,
  within,
  screen,
} from '@testing-library/react';
import uniqueId from 'lodash/uniqueId';

import '../../../../test/jest/__mock__';

import userEvent from '@testing-library/user-event';
import { queryClient } from '../../../../test/jest/utils/queryClient';
import { APPROACHES, CAPABILITIES, CRITERIA, IDENTIFIERS } from '../../../constants';
import { BulkEditMarcLayer } from './BulkEditMarcLayer';
import { RootContext } from '../../../context/RootContext';
import { getMarcFieldTemplate } from '../BulkEditListResult/BulkEditMarc/helpers';
import { ACTIONS } from '../../../constants/marcActions';

const mockConfirmChanges = jest.fn();
const mockMarcContentUpdate = jest.fn().mockReturnValue('marcContentUpdate');
const mockContentUpdate = jest.fn();

jest.mock('../../../hooks/useConfirmChanges', () => ({
  useConfirmChanges: jest.fn(() => ({
    confirmChanges: mockConfirmChanges,
    totalRecords: 1,
  })),
}));

jest.mock('../../../hooks/api/useMarcContentUpdate', () => ({
  useMarcContentUpdate: jest.fn(() => ({
    marcContentUpdate: mockMarcContentUpdate,
  })),
}));

jest.mock('../../../hooks/api/useContentUpdate', () => ({
  useContentUpdate: jest.fn(() => ({
    contentUpdate: mockContentUpdate,
  })),
}));

const closeMarcLayerFn = jest.fn();
const setCountOfRecordsMockFn = jest.fn();
const title = 'Title';
const fileName = 'TestMock.cvs';
const paneTitle = 'Pane Title';
const paneSub = 'Pane Sub Title';
const paneFooter = 'Pane Footer';

const WrapComponent = ({ children }) => {
  const [fields, setFields] = React.useState([getMarcFieldTemplate(uniqueId())]);

  return children(fields, setFields);
};

const renderBulkEditMarcLayer = ({ criteria }) => {
  const params = new URLSearchParams({
    criteria,
    approach: APPROACHES.MARC,
    capabilities: CAPABILITIES.INSTANCE_MARC,
    identifier: IDENTIFIERS.INSTANCE_HRID,
    fileName: 'instances.csv',
  }).toString();
  return render(
    <QueryClientProvider client={queryClient}>
      <WrapComponent>
        {(fields, setFields) => (
          <RootContext.Provider value={{
            setCountOfRecords: setCountOfRecordsMockFn,
            fileName,
            title,
            setFields,
            fields,
          }}
          >
            <MemoryRouter initialEntries={[`/bulk-edit/1/preview?${params}`]}>
              <BulkEditMarcLayer
                bulkOperationId="1"
                onMarcLayerClose={closeMarcLayerFn}
                isMarcLayerOpen
                paneProps={{
                  paneTitle,
                  paneSub,
                  paneFooter,
                }}
              />
            </MemoryRouter>
          </RootContext.Provider>
        )}

      </WrapComponent>
    </QueryClientProvider>
  );
};

describe('BulkEditMarcLayer', () => {
  it('should render correct layer titles', () => {
    const { getByText } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    expect(getByText(title))
      .toBeVisible();
    expect(getByText(paneTitle))
      .toBeVisible();
    expect(getByText(paneSub))
      .toBeVisible();
  });

  it('should render correct Marc Repeatable fields', () => {
    const {
      getByText,
      getAllByText,
      getByRole,
    } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    // columns
    expect(getByText('ui-bulk-edit.layer.column.field'))
      .toBeVisible();
    expect(getByText('ui-bulk-edit.layer.column.ind1'))
      .toBeVisible();
    expect(getByText('ui-bulk-edit.layer.column.ind2'))
      .toBeVisible();
    expect(getByText('ui-bulk-edit.layer.column.subfield'))
      .toBeVisible();
    expect(getAllByText('ui-bulk-edit.layer.column.actions').length)
      .toBe(4); // 3 actions for MarcField + 1 for Administrative data

    // tooltips
    expect(getByText('ui-bulk-edit.layer.marc.error.limited'))
      .toBeVisible();

    // controls
    expect(getByRole('textbox', { name: /ui-bulk-edit.layer.column.field/i }))
      .toBeVisible();
    expect(getByRole('textbox', { name: /ui-bulk-edit.layer.column.ind1/i }))
      .toBeVisible();
    expect(getByRole('textbox', { name: /ui-bulk-edit.layer.column.ind2/i }))
      .toBeVisible();
    expect(getByRole('textbox', { name: /ui-bulk-edit.layer.column.subfield/i }))
      .toBeVisible();
    expect(getByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i }))
      .toBeVisible();
  });

  it('should call setFields when value changed + only 3 chars allowed', async () => {
    const { getByRole } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    const inputField = getByRole('textbox', { name: /ui-bulk-edit.layer.column.field/i });

    expect(inputField)
      .toHaveValue('');

    userEvent.type(inputField, '1234');

    await waitFor(() => {
      expect(inputField)
        .toHaveValue('123');
    });
  });

  it('should show error message if value is 00x', async () => {
    const { getByRole } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    const inputField = getByRole('textbox', { name: /ui-bulk-edit.layer.column.field/i });

    expect(inputField)
      .toHaveValue('');

    userEvent.type(inputField, '002');

    await waitFor(() => {
      expect(screen.getByText('ui-bulk-edit.layer.marc.error'))
        .toBeVisible();
    });
  });

  it('should put backslash in ind1 field if its empty', async () => {
    renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    const inputField = screen.getByTestId('ind1-0');

    expect(inputField)
      .toHaveValue('\\');

    userEvent.clear(inputField);

    userEvent.tab();

    await waitFor(() => {
      expect(inputField)
        .toHaveValue('\\');
    });
  });

  it('should add and remove rows when + or trash buttons clicked', async () => {
    const { getAllByRole } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    const marcAccordion = getAllByRole('region')[2];

    const addBtn = within(marcAccordion).getByRole('button', { name: /plus-sign/i });
    const trashBtn = within(marcAccordion).getByRole('button', { name: /trash/i });

    expect(within(marcAccordion).getAllByRole('button', { name: /plus-sign/i }).length)
      .toBe(1);

    userEvent.click(addBtn);

    await waitFor(() => {
      expect(within(marcAccordion).getAllByRole('button', { name: /plus-sign/i }).length)
        .toBe(2);
    });

    userEvent.click(trashBtn);

    await waitFor(() => {
      expect(within(marcAccordion).getAllByRole('button', { name: /plus-sign/i }).length)
        .toBe(1);
    });
  });


  it('should work correctly with "Add" + "Add subfield" actions', async () => {
    const {
      queryByTestId,
      getByTestId,
      getByRole,
      getAllByRole
    } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    const actionSelect = getByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i });

    // select first action
    userEvent.selectOptions(actionSelect, ACTIONS.ADD_TO_EXISTING);

    await waitFor(() => {
      expect(getByRole('textbox', { name: /ui-bulk-edit.layer.column.data/i }))
        .toBeVisible();
      expect(getAllByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i }))
        .toHaveLength(2);
    });

    // select second action
    const secondAction = getAllByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i })[1];

    userEvent.selectOptions(secondAction, ACTIONS.ADDITIONAL_SUBFIELD);

    // when second action selected - should render subfield row
    await waitFor(() => {
      expect(getByTestId('subfield-row-0'))
        .toBeVisible();
    });

    const secondSubfieldAction = within(getByTestId('subfield-row-0'))
      .getAllByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i })[1];

    userEvent.selectOptions(secondSubfieldAction, ACTIONS.ADDITIONAL_SUBFIELD);

    // when second action of subfield selected - should render new subfield row
    await waitFor(() => {
      expect(getByTestId('subfield-row-1'))
        .toBeVisible();
    });

    // remove subfield
    const trashBtn = within(getByTestId('subfield-row-0'))
      .getByRole('button', { name: /trash/i });

    userEvent.click(trashBtn);

    await waitFor(() => {
      expect(queryByTestId('subfield-row-1'))
        .toBeNull();
    });

    const lastTrashButton = within(getByTestId('subfield-row-0'))
      .getByRole('button', { name: /trash/i });

    userEvent.click(lastTrashButton);

    await waitFor(() => {
      expect(getAllByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i })[1])
        .toHaveValue('');
    });
  });

  it('should work correctly with "Find" + "Replace with" actions', async () => {
    const {
      getByRole,
      getAllByRole
    } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    const actionSelect = getByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i });

    // select first action
    userEvent.selectOptions(actionSelect, ACTIONS.FIND);

    await waitFor(() => {
      expect(getAllByRole('textbox', { name: /ui-bulk-edit.layer.column.data/i })).toHaveLength(1);
      expect(getAllByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i })).toHaveLength(2);
    });

    // select second action
    const secondAction = getAllByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i })[1];

    userEvent.selectOptions(secondAction, ACTIONS.REPLACE_WITH);

    await waitFor(() => {
      expect(getAllByRole('textbox', { name: /ui-bulk-edit.layer.column.data/i })).toHaveLength(2);
    });
  });

  it('should call "confirm changes" function', async () => {
    const {
      getByRole,
      getAllByRole,
    } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    const marcAccordion = getAllByRole('region')[2];

    const actionSelect = within(marcAccordion).getByRole('combobox', { name: /ui-bulk-edit.layer.column.action/i });
    const inputField = within(marcAccordion).getByRole('textbox', { name: /ui-bulk-edit.layer.column.field/i });
    const inputSubField = within(marcAccordion).getByRole('textbox', { name: /ui-bulk-edit.layer.column.subfield/i });

    userEvent.type(inputField, '555');
    userEvent.type(inputSubField, 'a');
    userEvent.selectOptions(actionSelect, ACTIONS.REMOVE_ALL);

    const confirmChangesBtn = getByRole('button', { name: /ui-bulk-edit.layer.confirmChanges/i });

    userEvent.click(confirmChangesBtn);

    await waitFor(() => {
      expect(mockConfirmChanges).toHaveBeenCalledWith(['marcContentUpdate']);
    });
  });

  it('should show info popover if field 999 and indicators are "f"', async () => {
    const {
      getByRole,
    } = renderBulkEditMarcLayer({ criteria: CRITERIA.IDENTIFIER });

    const inputField = getByRole('textbox', { name: /ui-bulk-edit.layer.column.field/i });
    const ind1Field = getByRole('textbox', { name: /ui-bulk-edit.layer.column.ind1/i });
    const ind2Field = getByRole('textbox', { name: /ui-bulk-edit.layer.column.ind2/i });

    userEvent.type(inputField, '999');
    userEvent.type(ind1Field, 'f');
    userEvent.type(ind2Field, 'f');

    await waitFor(() => {
      expect(getByRole('button', { name: /info/i }))
        .toBeVisible();
    });
  });
});