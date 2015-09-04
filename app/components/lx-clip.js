import Ember from 'ember';
import RequireAttributes from 'linx/lib/require-attributes';
import cssStyle from 'linx/lib/computed/css-style';

export default Ember.Component.extend(
  RequireAttributes('clip', 'metronome', 'pxPerBeat'), {

  classNames: ['LxClip'],
  attributeBindings: ['componentStyle:style'],

  componentStyle: cssStyle({
    'left': 'startPx',
    'width': 'widthPx',
  }),

  // params
  clipEvent: null,

  updateClipEvent: function() {
    Ember.run.once(this, '_updateClipEvent');
  }.observes('metronome', 'clip').on('init'),

  _updateClipEvent: function() {
    let clip = this.get('clip');
    let metronome = this.get('metronome');

    // re-sync clip and metronome
    if (!(metronome && clip)) {
      this.destroyClipEvent();
    } else {
      let clipEvent = this.get('clipEvent');

      if (!clipEvent) {
        clipEvent = metronome.createClipEvent(clip);
      } else {
        clipEvent.set('clip', clip);
      }

      this.set('clipEvent', clipEvent);
    }
  },

  destroyClipEvent: function() {
    let clipEvent = this.get('clipEvent');

    clipEvent && clipEvent.destroy();

    this.set('clipEvent', undefined);
  }.on('willDestroyElement'),

  startPx: function() {
    return this.beatToPx(this.get('clip.startBeat')) + 'px';
  }.property('clip.startBeat', 'pxPerBeat'),

  endPx: function() {
    return this.beatToPx(this.get('clip.endBeat')) + 'px';
  }.property('clip.endBeat', 'pxPerBeat'),

  widthPx: function() {
    return this.beatToPx(this.get('clip.numBeats')) + 'px';
  }.property('clip.numBeats', 'pxPerBeat'),

  beatToPx: function(beat) {
    return beat * this.get('pxPerBeat'); // beat * (px / beat) = px
  }
});