import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { IndexPage } from '~/linodes/layouts/IndexPage';
import { UPDATE_LINODES } from '~/actions/api/linodes';
import * as fetch from '~/fetch';
import { testLinode } from '~/../test/data';

describe('linodes/layouts/IndexPage', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  const dispatch = sandbox.spy();

  const linodes = {
    pagesFetched: [0],
    totalPages: 1,
    linodes: [
      testLinode,
      { ...testLinode, id: 'linode_1235' },
      { ...testLinode, id: 'linode_1236', state: 'offline' },
    ],
    _singular: 'linode',
    _plural: 'linodes',
  };

  it('dispatches a linodes fetch action when mounted', async () => {
    mount(
      <IndexPage
        dispatch={dispatch}
        view={'grid'}
        selected={{}}
        linodes={linodes}
      />);
    expect(dispatch.calledOnce).to.equal(true);
    const dispatched = dispatch.firstCall.args[0];
    // Assert that dispatched is a function that fetches linodes
    const fetchStub = sandbox.stub(fetch, 'fetch').returns({
      json: () => {},
    });
    dispatch.reset();
    await dispatched(dispatch, () => ({
      authentication: { token: 'token' },
    }));
    expect(fetchStub.calledOnce).to.equal(true);
    expect(fetchStub.firstCall.args[1]).to.equal('/linodes?page=1');
    expect(dispatch.calledOnce).to.equal(true);
    expect(dispatch.firstCall.args[0].type).to.equal(UPDATE_LINODES);
  });

  it('renders a grid of Linodes', () => {
    const page = mount(
      <IndexPage
        dispatch={dispatch}
        view={'grid'}
        selected={{}}
        linodes={linodes}
      />
    );

    const gridRow = page.find('.linodes-page > .row');
    expect(gridRow.length).to.equal(1);
    expect(gridRow.find('.col-md-4').length).to.equal(linodes.linodes.length);
  });

  it('renders a list of Linodes', () => {
    const page = mount(
      <IndexPage
        dispatch={dispatch}
        view={'list'}
        selected={{}}
        linodes={linodes}
      />
    );

    const table = page.find('.linodes-page > .linodes > table');
    expect(table.length).to.equal(1);
    expect(table.find('tbody tr').length).to.equal(linodes.linodes.length);
  });

  it('renders a power management dropdown');

  it('renders a "select all" checkbox');

  it('renders an "add a linode" button'); // should also confirm Link.to == /linodes/create

  it('selects all linodes when "select all" is checked');

  it('changes the view when the grid or list links are clicked');

  it('dispatches the appropriate action for selected linodes when dropdown is clicked');
});
