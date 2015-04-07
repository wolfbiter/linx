Template.Add_Button.created = function() {
  Utils.initTemplateModel.call(this, 'track');
};

function getTrack(template) {
  return template.data.track;
}

function getWave(template) {
  return getTrack(template).getWave();
}

Template.Add_Button.helpers({
  isDirty: function() {
    var track = getTrack(Template.instance());
    return track.isDirty();
  },
});