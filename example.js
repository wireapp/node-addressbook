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


const ab = require("./build/Release/electron-addressbook")();

// Addressbook has a member me that represents the current user.
// contacts member is an array of all contacts (includes the me user)
//
// me and contact objects have the following members:
// firstName - string
// lastName - string
// emails - array of strings of email addresses
// numbers - array of strings of phone numbers


function logPerson(p, typ) {
	console.log(typ + ": " + p.firstName + " " + p.lastName);

	for(var x = 0; x < p.emails.length; x++) {
		console.log("  Email: " + p.emails[x]);
	}

	for(var x = 0; x < p.numbers.length; x++) {
		console.log("  Phone: " + p.numbers[x]);
	} 
}

logPerson(ab.me, "Me");

console.log("" + ab.contacts.length + " contacts");

for(p = 0; p < ab.contacts.length; p++) {
	logPerson(ab.contacts[p], "Contact");
}

logPerson(ab.getMe(), "Me2");
console.log("" + ab.contactCount() + " contacts");

for(p = 0; p < ab.contactCount(); p++) {
	logPerson(ab.getContact(p), "Contact");
}

