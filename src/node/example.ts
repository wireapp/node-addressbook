/*
 * Wire
 * Copyright (C) 2016 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Addressbook has a member `me` that represents the current user.
 * contacts member is an array of all contacts (includes the `me` user)
 *
 * `me` and contact objects have the following members:
 * `emails` - array of strings of email addresses
 * `firstName` - string
 * `lastName` - string
 * `numbers` - array of strings of phone numbers
 */

import * as progress from 'progress';
import * as addressBook from './';

const me = addressBook.getMe();
const contact0 = addressBook.getContact(0);
const contactsCount = addressBook.getContactsCount();

const progressBar = new progress('Loading: [:bar] :percent :elapseds', {
  complete: '=',
  incomplete: ' ',
  total: 100,
  width: 40,
});

console.log('Me:', me);
console.log('Contact [0]:', contact0);
console.log('Number of contacts:', contactsCount);

let lastProgress = 0;

progressBar.tick();
addressBook.getContacts(
  progress => {
    if (progress > lastProgress) {
      progressBar.tick();
      lastProgress = progress;
    }
  },
  contacts => {
    console.log('Contacts with callback:', contacts);
  }
);

addressBook
  .getContacts()
  .then(contacts => console.log('Contacts asynchronously:', contacts))
  .catch(error => console.error(error));
