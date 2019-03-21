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

import {AddressBook, ContactInformation, OnFinishCallback, OnProgressCallback} from './addressbook-module';

const addressbook: AddressBook = require('../build/Release/electron-addressbook');

/**
 * Get all contacts information from the AddressBook
 *
 * @param onProgress Callback provides overall process percent as an integer value between 1 to 100
 * @param onFinish Callback provides an array contains all of the Addressbook contacts information
 */
function getContacts(): Promise<ContactInformation>;
function getContacts(onProgress: OnProgressCallback, onFinish: OnFinishCallback): void;
function getContacts(onProgress?: OnProgressCallback, onFinish?: OnFinishCallback): void | Promise<ContactInformation> {
  if (!onProgress && !onFinish) {
    return new Promise((resolve, reject) => {
      try {
        addressbook.getContacts(
          () => {},
          data => {
            resolve(data);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  return addressbook.getContacts(onProgress, onFinish);
}

export const getContact = addressbook.getContact;
export const getMe = addressbook.getMe;
export const getContactsCount = addressbook.getContactsCount;

export {getContacts};
