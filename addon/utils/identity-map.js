import Ember from 'ember';

const {
  A,
  assert,
  computed,
  get,
  merge
} = Ember;

var IdentityMap = Ember.Object.extend({
  key: null,
  _records: null,

  _allArray: computed('_records', function () {
    let records = this._records;
    return A(Object.keys(records).map(key => get(records, key))); // jshint ignore:line
  }),

  init () {
    assert('A key must be provided at instantiation', this.key);
    this.clear();
  },

  pushOne (object) {
    this._updateRecord(object);
    this._notifyRecordsChanged();
  },

  pushMany (array) {
    array.forEach(object => this._updateRecord(object));
    this._notifyRecordsChanged();
  },

  getOne (key) {
    return this._getAtKey(key);
  },

  // TODO: make this return a live array - use array proxy?
  getAll () {
    return this.get('_allArray');
  },

  has (key) {
    return undefined !== this._getAtKey(key);
  },

  delete (key) {
    this._setAtKey(key, undefined);
    this._notifyRecordsChanged();
  },

  clear () {
    this._records = Object.create(null);
    this._notifyRecordsChanged();
  },

  _setAtKey (key, object) {
    this._records[key] = object;
  },

  _getAtKey (key) {
    return this._records[key];
  },

  _notifyRecordsChanged () {
    this.notifyPropertyChange('_records');
  },

  _updateRecord (object) {
    let keyProp = this.key,
        key = get(object, keyProp);
    assert(`object must have a valid '${keyProp}' property`, key);

    if (this.has(key)) {
      merge(this.getOne(key), object);
    } else {
      this._setAtKey(key, object);
    }
  },

  // As long as getAll returns the same array, a filter function could be
  // easily implemented by a consumer. Providing this method would be more
  // convenient though.
  filter (/*callback*/) {},

  // Use for localstorage? Or should that interaction happen elsewhere?
  typeKey: null,
  afterPush () {}
});

export default IdentityMap;
