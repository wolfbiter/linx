import Ember from 'ember';
import DS from 'ember-data';
import Clip from './clip';

export default Clip.extend({
  type: Ember.computed(() => { return 'track-clip'; }),

  startBeat: Ember.computed.alias('mixItem.trackStartBeat'),
  numBeats: Ember.computed.alias('mixItem.numTrackBeats'),

  track: Ember.computed.alias('mixItem.track'),

  mixItem: DS.belongsTo('mix-list-item', { async: true })
});
