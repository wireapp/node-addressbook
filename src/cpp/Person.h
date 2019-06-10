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
//

#ifndef PERSON_H
#define PERSON_H

#include <string>
#include <vector>
#ifdef __APPLE__
#include <AddressBook/ABAddressBookC.h>
#endif

typedef std::vector<std::string> stringvector;

class Person {
 public:
  Person();
#ifdef __APPLE__
  Person(ABPersonRef p);
#endif

  const std::string& firstName() const { return m_firstName; }

  const std::string& lastName() const { return m_lastName; }

  const std::string& uid() const { return m_uid; }

  const stringvector& numbers() const;
  const stringvector& emails() const;

 private:
#ifdef __APPLE__
  static std::string CFString2String(CFStringRef str);
  static std::string getStringProperty(ABPersonRef person, CFStringRef propertyName);
  static void fillPropertyVector(ABPersonRef person, CFStringRef propertyName, stringvector& vec);
#endif
  std::string m_firstName;
  std::string m_lastName;
  std::string m_uid;
  stringvector m_numbers;
  stringvector m_emails;
};

#endif  // PERSON_H
