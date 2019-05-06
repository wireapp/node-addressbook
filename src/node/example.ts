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

import * as readline from 'readline';
import * as addressBook from './';

console.log('Me:', addressBook.getMe());
console.log('Contact [0]:', addressBook.getContact(0));
console.log('Number of contacts:', addressBook.getContactsCount());
console.log('Start importing contacts');

addressBook.getContacts(
  progress => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Progress: ${progress}%`);
  },
  contacts => console.log('Contacts', contacts)
);

addressBook
  .getContacts()
  .then(contacts => console.log('Contacts', contacts))
  .catch(error => console.error(error));
