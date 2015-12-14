/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent.skip(
  'arrangement-grid/clip',
  'Integration: ArrangementGridClipComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#arrangement-grid/clip}}
      //     template content
      //   {{/arrangement-grid/clip}}
      // `);

      this.render(hbs`{{arrangement-grid/clip}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
