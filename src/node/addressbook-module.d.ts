/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
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

export interface ContactInformation {
  emails: string[];
  firstName: string;
  lastName: string;
  numbers: string[];
}

export type OnProgressCallback = (progress: number) => void;
export type OnFinishCallback = (contacts: ContactInformation) => void;

export default interface AddressBook {
  getContact(index?: number): ContactInformation;
  getMe(): ContactInformation;
  getContactsCount(): number;
  getContacts(onProgress?: OnProgressCallback, onFinish?: OnFinishCallback): void;
}
