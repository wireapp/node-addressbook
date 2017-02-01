//
// Wire
// Copyright (C) 2016 Wire Swiss GmbH
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

const addressbook = require('./build/Release/electron-addressbook');
const lib = {
    /**
     * Get Contact Information from the AddressBook using it's index
     *
     * @param {int} [index] contact index in the Addressbook
     * @return {Object} Contact Information
     */
    getContact: function (index) {
        return addressbook.getContact(index);
    },
    /**
     * Get Contact Information for the logged-in user
     *
     * @return {Object} Contact Information
     */
    getMe: function () {
        return addressbook.getMe();
    },
    /**
     * Returns the number of contacts in the AddressBook.
     *
     * @return {int} number of contacts in the AddressBook.
     */
    getContactsCount: function () {
        return addressbook.getContactsCount();
    },
    /**
     * Get all contacts information from the AddressBook
     *
     * @param {Function} [onProgress] Callback provides overall process percent as an integer value between 1 to 100
     * @param {Function} [onFinish] Callback provides an array contains all of the Addressbook contacts information
     */
    getContacts: function (onProgress, onFinish) {
        return addressbook.getContacts(onProgress, onFinish)
    }
};

module.exports = lib;