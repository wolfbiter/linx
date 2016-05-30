import Ember from 'ember';
import DS from 'ember-data';

import Clip from './clip';
import TrackClipMixin from 'linx/mixins/playable-arrangement/track-clip';
import { withDefaultProperty } from 'linx/lib/computed/with-default';
import DependentRelationshipMixin from 'linx/mixins/models/dependent-relationship';

export default Clip.extend(
  DependentRelationshipMixin('track'),
  TrackClipMixin, {

  // implement clip
  startBeat: DS.attr('number', { defaultValue: 0 }),

  // implement track-clip
  track: DS.belongsTo('track', { async: true }),
  audioStartTime: withDefaultProperty('_audioStartTime', '_defaultAudioStartTime'),
  audioEndTime: withDefaultProperty('_audioEndTime', '_defaultAudioEndTime'),
  transpose: DS.attr('number', { defaultValue: 0 }),

  _audioStartTime: DS.attr('number'),
  _audioEndTime: DS.attr('number'),
  _defaultAudioStartTime: 0,
  _defaultAudioEndTime: Ember.computed.reads('audioMeta.duration'),

  audioMeta: Ember.computed.reads('track.audioMeta'),
});
