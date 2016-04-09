import Ember from 'ember';

import _ from 'npm:underscore';

import BubbleActions from 'linx/lib/bubble-actions';
import RequireAttributes from 'linx/lib/require-attributes';
import ArrangementPlayerMixin from 'linx/mixins/components/arrangement-player';
import ArrangementVisualMixin from 'linx/mixins/components/arrangement-visual';

import { variableTernary } from 'linx/lib/computed/ternary';

export const MIX_ITEM_PREVIEW_DISTANCE = 4;

export const FROM_TRACK_COLOR = '#ac6ac7';
export const TO_TRACK_COLOR = '#16a085';

import {
  BAR_QUANTIZATION,
  BEAT_QUANTIZATION,
  TICK_QUANTIZATION,
  MS10_QUANTIZATION,
  MS1_QUANTIZATION,
  SAMPLE_QUANTIZATION,
} from 'linx/models/track/audio-meta/beat-grid';

export default Ember.Component.extend(
  ArrangementPlayerMixin,
  ArrangementVisualMixin,
  BubbleActions('saveMix', 'deleteMix', 'didSelectClip'),
  RequireAttributes('mix', 'store'), {

  classNames: ['MixBuilder'],
  classNameBindings: [],

  // optional params
  showArrangement: true,
  selectedClip: null,
  defaultPxPerBeat: 1,
  zoomedPxPerBeat: 25,

  // implement ArrangementPlayerMixin
  arrangement: Ember.computed.reads('mix'),

  hasSelectedClip: Ember.computed.bool('selectedClip'),
  pxPerBeat: variableTernary('hasSelectedClip', 'zoomedPxPerBeat', 'defaultPxPerBeat'),

  selectedTransition: Ember.computed.reads('selectedClip.transition.content'),

  selectedQuantizations: [BAR_QUANTIZATION],
  selectedQuantization: Ember.computed.reads('selectedQuantizations.firstObject'),

  actions: {
    resetMix() {
      // TODO: dependentRelationship.rollbackAttributes
      // TODO: orderedHasMany.rollbackAttributes
      this.get('mix').rollbackAttributes();
    },

    saveSelectedClip() {
      const selectedClip = this.get('selectedClip');
      selectedClip && selectedClip.save();
    },

    playItem(mixItem) {
      mixItem.get('transitionClip').then((clip) => {
        this.send('play', clip.get('startBeat') - MIX_ITEM_PREVIEW_DISTANCE);
      });
    },

    viewTrack(mixItem) {
      mixItem.get('trackClip').then((clip) => {
        this.send('zoomToClip', clip);
      });
    },

    selectQuantization(quantization) {
      this.set('selectedQuantizations', [quantization]);
    },

    viewTransition(mixItem) {
      mixItem.get('transitionClip').then((clip) => {
        this.send('didSelectClip', clip);

        Ember.run.next(() => {
          this.send('zoomToClip', clip);
        });
      });
    },

    clearSelectedClip() {
      const selectedClip = this.get('selectedClip');
      if (selectedClip) {
        this.send('didSelectClip', null);

        Ember.run.next(() => {
          this.send('zoomToClip', selectedClip);
        });
      }
    },

    optimizeTransition(transition) {
      transition && transition.optimize();
    },

    removeItem(mixItem) {
      const mix = this.get('mix');
      mix.removeObject(mixItem);
    },

    addTrack(track) {
      const mix = this.get('mix');

      mix.appendTrack(track);
    },

    appendRandomTrack() {
      const mix = this.get('mix');
      const tracks = this.get('searchTracks.content');
      const randomTrack = _.sample(tracks.toArray());

      mix.appendTrack(randomTrack);
    },

    // TODO(REFACTOR2): move to mix-builder/transition-clip?
    onTransitionClipDrag(d3Context, clip, dBeats) {
      const newBeat = this.get('_dragStartBeat') + dBeats;
      Ember.run.throttle(this, 'moveTrackClip', clip.get('fromTrackClip'), 'audioEndBeat', newBeat, 10, true);
    },

    onTransitionClipDragStart(d3Context, clip) {
      this.set('_dragStartBeat', clip.get('fromTrackClip.audioEndBeat'));
    },

    toggleShowVolumeAutomation() {
      this.toggleProperty('showVolumeAutomation');
    },

    quantizeBeat(beat) {
      const quantization = this.get('selectedQuantization');

      let quantizedBeat;
      switch (quantization) {
        case BEAT_QUANTIZATION:
          quantizedBeat = Math.round(beat);
          break;
        case BAR_QUANTIZATION:
          // TODO(TECHDEBT)
          quantizedBeat = Math.round(beat);
          // quantizedBeat = beatGrid.barToBeat(beatGrid.quantizeBar(beatGrid.beatToBar(beat)));
          break;
        default: quantizedBeat = beat;
      };

      return quantizedBeat;
    },
  },

  showVolumeAutomation: true,

  searchTracks: Ember.computed(function() {
    return this.get('store').findAll('track');
  }),

  // // Hacky stuff to convert <input type="number"> values to numbers
  // inputBpm: Ember.computed.oneWay('metronome.bpm'),
  // inputZoom: Ember.computed.oneWay('pxPerBeat'),
  // _inputBpmDidChange: function() {
  //   this.get('metronome').setBpm(parseFloat(this.get('inputBpm')));
  // }.observes('inputBpm'),
  // _inputZoomDidChange: function() {
  //   // update pxPerBeat
  //   this.set('pxPerBeat', parseFloat(this.get('inputZoom')));
  // }.observes('inputZoom'),
  // // /hacky stuff
});
