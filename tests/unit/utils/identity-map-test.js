import IdentityMap from '../../../utils/identity-map';
import { module, test, skip } from 'qunit';

var im = null;

var records = null;

module('Unit | Utility | identity map', {
  beforeEach () {
    records = {
      '1': { id: '1' },
      '2': { id: '2' }
    };

    im = IdentityMap.create({ key: 'id' });
    im.set('_records', records);
  },

  afterEach () {
    im = null;
    records = null;
  }
});

test('has', function(assert) {
  assert.expect(2);

  assert.ok(im.has('1'), 'should have record');
  assert.notOk(im.has('3'), 'should not have record');
});

test('clear', function(assert) {
  assert.expect(2);

  assert.ok(im.has('1'), 'should have record');

  im.clear();

  assert.notOk(im.has('1'), 'record should be cleared');
});

test('delete', function(assert) {
  assert.expect(2);

  assert.ok(im.has('1'), 'should have record');

  im.delete('1');

  assert.notOk(im.has('1'), 'record should be cleared');
});

test('getOne', function(assert) {
  assert.expect(1);

  assert.equal(im.getOne('1'), records['1'], 'should have record');
});

test('getAll', function(assert) {
  assert.expect(1);

  let all = im.getAll();

  assert.equal(all.get('length'), 2, 'should return all records');
});

skip('getAll returns a live array', function(assert) {
  assert.expect(2);

  let all = im.getAll();

  assert.equal(all.get('length'), 2, 'should return all records');

  var moreRecords = {
    '1': { id: '1' },
    '2': { id: '2' },
    '3': { id: '3' }
  };

  im.set('_records', moreRecords);

  assert.equal(all.get('length'), 3, 'already fetched array should be updated');
});

test('pushOne - adds as new record if not in identity map', function(assert) {
  assert.expect(2);

  let obj = { id: 'someId' };
  im.pushOne(obj);

  assert.ok(im.has('someId'), 'should have the new record');
  assert.equal(obj, im.getOne('someId'), 'should return the same object');
});

test('pushOne - updates existing record if in identity map', function(assert) {
  assert.expect(1);

  let obj = { id: 'someId' };
  im.pushOne(obj);

  obj.someProperty = 'value';

  assert.equal(im.getOne('someId').someProperty, 'value', 'the object should be mutated');
});

test('pushMany', function(assert) {
  assert.expect(3);

  var newRecords = [
    { id: '2', prop: 'data2' },
    { id: '3', prop: 'data3' }
  ];

  im.pushMany(newRecords);

  let all = im.getAll();

  assert.equal(all.get('length'), 3, 'should return 3 records');
  assert.equal(all.findBy('id', '2').prop, 'data2', 'the record should be updated');
  assert.equal(all.findBy('id', '3').prop, 'data3', 'the record should be updated');
});

skip('filter');
