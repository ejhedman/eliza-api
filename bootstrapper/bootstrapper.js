'use strict';

const clearDb = require('./clearDb');
const fakeMembers = require('./fakeMembers');

const bootstrapper = async () => {
  await clearDb()
  await fakeMembers()
}

module.exports = bootstrapper
