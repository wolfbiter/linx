Template.transition.events({
  'click': function() {
    Session.set("selected_transition", this._id);
  },
  'dblclick': function() {
    Session.set("selected_transition", this._id);
    Mixer.queue(Transitions.findOne(this._id));
  }
});

Template.song.events({
  'click': function(e) {
    Session.set("selected_song", this._id);
  },
  'dblclick': function(e) {
    Session.set("selected_song", this._id);

    // if song select modal is active, this serves as a click to the load song button
    if (Session.get("song_select_dialog")) {
      uploaderLoadSong(e);
    }
    // queue a "soft" transition to this song if we already have a queue
    else if (Mixer.getQueue().length > 0) {
      Mixer.queue(Songs.findOne(this._id));
    }
    // if we have no queue, start the mix with this song
    else {
      Mixer.play(Songs.findOne(this._id));
    }
  }
});

Template.transitions.transitions = function () {
  return Transitions.find();
}

Template.songs.songs = function () {
  return Songs.find(
    { name: { $regex: Session.get("search_query") } },
    { sort: { name: 1 } }
  );
};

Template.transition.selected = function () {
  return Session.equals("selected_transition", this._id) ? "selected" : "";
};

Template.transition.current = function () {

  return Session.equals("current_transition", this._id) ? "current" : "";
};

Template.song.selected = function () {
  return Session.equals("selected_song", this._id) ? "selected" : "";
};

Template.song.current = function () {
  return Session.equals("current_song", this._id) ? "current" : "";
};