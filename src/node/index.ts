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

const {
  getContact,
  getMe,
  getContacts: nativeGetContacts,
  getContactsCount,
}: AddressBook = require('../build/Release/electron-addressbook');

export interface ContactInformation {
  emails: string[];
  firstName: string;
  lastName: string;
  numbers: string[];
}

type OnProgressCallback = (progress: number) => void;
type OnFinishCallback = (contacts: ContactInformation) => void;

interface AddressBook {
  /**
   * Get Contact Information from the AddressBook using it's index
   *
   * @param index contact index in the Addressbook
   * @returns Contact Information
   */
  getContact(index?: number): ContactInformation;

  /**
   * Get Contact Information for the logged-in user
   *
   * @returns Contact Information
   */
  getMe(): ContactInformation;

  /** Returns the number of contacts in the AddressBook. */
  getContactsCount(): number;

  /**
   * Get all contacts information from the AddressBook
   *
   * @param onProgress Callback provides overall process percent as an integer value between 1 to 100
   * @param onFinish Callback provides an array contains all of the Addressbook contacts information
   */
  getContacts(onProgress?: OnProgressCallback, onFinish?: OnFinishCallback): void;
}

function getContacts(): Promise<ContactInformation>;
function getContacts(onProgress: OnProgressCallback, onFinish: OnFinishCallback): void;
function getContacts(onProgress?: OnProgressCallback, onFinish?: OnFinishCallback): Promise<ContactInformation> | void {
  if (!onProgress && !onFinish) {
    return new Promise((resolve, reject) => {
      try {
        nativeGetContacts(
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
  return nativeGetContacts(onProgress, onFinish);
}

export {AddressBook, getContact, getContacts, getMe, getContactsCount, OnFinishCallback, OnProgressCallback};
