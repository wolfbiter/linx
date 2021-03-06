import Ember from 'ember';

import _ from 'npm:underscore';

import ENV from 'linx/config/environment';
import { executePromisesInSeries } from 'linx/lib/utils';

export default Ember.Route.extend({
  actions: {
    createMix() {
      const store = this.get('store');
      const mix = store.createRecord('mix', {
        title: 'Mix ' + Ember.uuid(),
      });

      // create the mix with a transition
      // const tracks = this.get('controller.tracks');
      // const [fromTrack, toTrack] = _.sample(tracks.toArray(), 2);
      // const [fromTrack, toTrack] = [tracks.objectAt(0), tracks.objectAt(1)];

      // Ember.Logger.log('fromTrack', fromTrack.get('title'));
      // Ember.Logger.log('toTrack', toTrack.get('title'));

      this.transitionTo('mixes.mix', mix.get('id'));
    },

    createCategoryMix() {
      var store = this.get('store');
      var mix = store.createRecord('mix', {
        title: 'Mix ' + Ember.uuid(),
      });

      $.get('/https://api-v2.soundcloud.com/explore/Popular+Music?tag=out-of-experiment&limit=10&offset=0&linked_partitioning=1&client_id=02gUJC0hH2ct1EGOcYXQIzRFU91c72Ea&app_version=56ba14a').then((response) => {
        Ember.Logger.log('RESPONSE', response);

        let soundcloudTracks = store.push({
          data: response.tracks.map((track) => {

            // add client_id to stream_url
            if (track.stream_url) {
              track.stream_url += `?client_id=${ENV.SC_KEY}`;
              track.streamUrl = track.stream_url;
            }

            return {
              id: track.id,
              type: 'soundcloud/track',
              attributes: track
            };
          }),
        });


        let tracks = soundcloudTracks.map((soundcloudTrack) => {
          let track = store.createRecord('track');
          track.createFromSoundcloudTrack(soundcloudTrack);
          return track;
        });

        mix.save().then(() => {
          // TODO: appendTracksWithTransitions
          executePromisesInSeries(tracks.map((track) => {
            mix.appendModelWithTransition(track);
          })).then(() => {
            this.transitionTo('mixes.mix', mix.get('id'));
          });
        });
      });
    },
  },

  soundcloud: Ember.inject.service(),

  setupController(controller, models) {
    controller.setProperties(models);
  },

  model: function() {
    let store = this.get('store');
    return Ember.RSVP.hash({
      mixes: store.findAll('mix'),
      // me: store.findRecord('soundcloud/me'),
      // tracks: store.findAll('track'),
    });
  }
});
