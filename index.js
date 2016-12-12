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

const addressbook = require('./build/Release/electron-addressbook')();
const lib = {
    getContact: function (position) {
        return addressbook.getContact(position);
    },
    getMe: function () {
        return addressbook.getMe();
    },
    getContactsCount: function () {
        return addressbook.contactCount();
    },
    getContacts: function (onProgress, onFinish) {
        const count = lib.getContactsCount();
        const contacts = [];
        if (count === 0) return onFinish(contacts);

        let progress = 0;
        for (let i = 0; i < count; i++) {
            setTimeout(function (index) {
                contacts.push(lib.getContact(index));
                progress = Math.floor((contacts.length / count) * 100) / 100;
                onProgress(progress);
                if (progress === 1) {
                    onFinish(contacts);
                }
            }.bind(null, i), 200);
        }
        return contacts;
    }
};

module.exports = lib;