import {
  beforeEach,
  describe,
  it
} from 'mocha';
import { describeModel } from 'ember-mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import startApp from 'linx/tests/helpers/start-app';

describeModel('track', 'Track',
  {
    needs: [
      'model:audio-meta',
      'model:marker',
    ]
  },
  function() {

  startApp();

  beforeEach(function() {
    console.log('track test before each');
    console.log('serve', server);
    var store = this.store();
  });

  it('can add track', function() {
    expect(true).to.be.true;
  });
});
