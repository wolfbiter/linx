import Ember from 'ember';
import DS from 'ember-data';
import {
  beforeEach,
  describe,
  it
} from 'mocha';
import { expect } from 'chai';

import setupTestEnvironment from 'linx/tests/helpers/setup-test-environment';
import describeAttrs from 'linx/tests/helpers/describe-attrs';
import { asResolvedPromise } from 'linx/lib/utils';

describe.skip('MixItemModel', function() {
  setupTestEnvironment();

  let mixItem;

  beforeEach(function() {
    console.log("before factory make");
    mixItem = this.factory.make('mix/item');
    console.log("after factory make");
  });

  describeAttrs('fromTrackClip', {
    subject() { console.log('subject'); let x = mixItem.get('fromTrackClip.content'); console.log('after subject'); return x},
    track() { return mixItem.get('fromTrack.content'); },
    arrangement() { return mixItem.get('mix.content'); },
    toTransitionClip() { return mixItem.get('transitionClip'); },
  });

  describeAttrs('toTrackClip', {
    subject() { return mixItem.get('toTrackClip.content'); },
    track() { return mixItem.get('toTrack.content'); },
    arrangement() { return mixItem.get('mix.content'); },
    fromTransitionClip() { return mixItem.get('transitionClip'); },
  });

  describe('#generateTransition', function() {
    let generatedTransition, fromTrack, toTrack;

    // TODO(TRANSITION): make this work for passing in only one track?
    describe('without constraints', function() {
      beforeEach(function() {
        fromTrack = this.factory.make('track');
        toTrack = this.factory.make('track');
        Ember.run(() => {
          wait(mixItem.generateTransition({ fromTrack, toTrack }).then((_transition) => {
            generatedTransition = _transition;
          }));
        });
      });

      describeAttrs('generatedTransition', {
        subject() { return generatedTransition; },
        'fromTrack.content': () => fromTrack,
        'toTrack.content': () => toTrack,
        fromTrackEndBeat() { return ~~fromTrack.get('audioMeta.endBeat'); },
        toTrackStartBeat() { return ~~toTrack.get('audioMeta.startBeat'); },
        numBeats: 16,
      });

      it('set transition on item model', function() {
        expect(mixItem.get('transition.content')).to.equal(generatedTransition);
      });

      it('returns a transition', function() {
        expect(transition.get('constructor.modelName')).to.equal('transition');
      });
    });

    // TODO(TRANSITION): write these tests with algorithm
    describe.skip('with constraints', function() {});
  });
});
