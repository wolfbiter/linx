MixModel = Graviton.Model.extend({
  belongsTo: {
    user: {
      collectionName: 'users',
      field: 'createdBy'
    },
  },
  hasMany: {
    elements: {
      collectionName: 'mixelements',
      foreignKey: 'mixId',
    },
  },
  defaults: {
    playCount: 0,
    title: 'New Mix',
    artist: 'No Artist',
  }
}, {
  clearElements: function() {
    this.elements.all().forEach(function(element) {
      element.remove();
    });
  },

  getElements: function() {
    if (!this.get('_id')) {
      return []; // TODO
    } else {
      return _.sortBy(this.elements.all(), function(e) {
        return e.get('index');
      });
    }
  },

  getElementAt: function(index) {
    var existing = this.elements.find({ index: index }).fetch()[0];
    console.log("get element at", index, existing);
    if (existing) {
      return existing;
    } else {
      return this.elements.add({
        'index': index,
      });
    }
  },

  getTrackAt: function(index) {
    if (!(_.isNumber(index) && index > -1)) { return; }
    return this.getElementAt(index).track();
  },

  getLinkAt: function(index) {
    if (!(_.isNumber(index) && index > -1)) { return; }
    return this.getElementAt(index).link();
  },

  getLength: function() {
    return this.getTracks().length;
  },

  getTracks: function() {
    var tracks = this.getElements().map(function(element) {
      return element.track();
    });
    console.log("get tracks", tracks, this.get('_id'));
    return _.without(tracks, undefined);
  },

  getLinks: function() {
    return this.getElements().map(function(element) {
      return element.link();
    });
  },

  addTrackAt: function(track, index) {
    if (!(_.isNumber(index) && index > -1)) { return; }
    var element = this.getElementAt(index);
    console.log("add track at", track, index);
    element.set('trackId', track.get('_id'));
    element.save();
  },

  addLinkAt: function(link, index) {
    if (!(_.isNumber(index) && index > -1)) { return; }
    var element = this.getElementAt(index);
    console.log("add link at", link, index);
    element.set('linkId', link.get('_id'));
  },

  removeTrackAt: function(index) {
    // TODO: remove links too?
    if (!(_.isNumber(index) && index > -1)) { return; }
    var element = this.getElementAt(index);
    element.set('trackId', undefined);
    element.save();
  },

  removeLinkAt: function(index) {
    if (!(_.isNumber(index) && index > -1)) { return; }
    var element = this.getElementAt(index);
    element.set('linkId', undefined);
    element.save();
  },
});

Mixes = Graviton.define("mixes", {
  modelCls: MixModel,
  timestamps: true,
});

// TODO
Mixes.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, docs, fields, modifier) {
    return true;
  },
  remove: function (userId, docs) {
    return true;
  }
});
