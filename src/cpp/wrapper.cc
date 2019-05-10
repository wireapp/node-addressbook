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

#include <nan.h>
#include <functional>
#include <iostream>
#include "AddressBook.h"

using namespace Nan;
using namespace std;
using namespace v8;

void setStringArray(Isolate* isolate, Local<Object> obj, const char* name, const stringvector& src) {
  Local<Array> array = Array::New(isolate);
  for (unsigned int i = 0; i < src.size(); i++) {
    Local<String> result = String::NewFromUtf8(isolate, src[i].c_str());
    array->Set(i, result);
  }
  obj->Set(String::NewFromUtf8(isolate, name), array);
}

void fillPersonObject(Isolate* isolate, Local<Object> obj, Person* person) {
  obj->Set(String::NewFromUtf8(isolate, "firstName"), String::NewFromUtf8(isolate, person->firstName().c_str()));
  obj->Set(String::NewFromUtf8(isolate, "lastName"), String::NewFromUtf8(isolate, person->lastName().c_str()));

  setStringArray(isolate, obj, "emails", person->emails());
  setStringArray(isolate, obj, "numbers", person->numbers());
}

class AddressBookWorker : public AsyncProgressWorker {
 public:
  AddressBookWorker(Callback* callback, Callback* progress)
      : AsyncProgressWorker(callback), progress(progress), contacts() {}

  ~AddressBookWorker() {}

  void Execute(const AsyncProgressWorker::ExecutionProgress& progress) {
    AddressBook ab;
    unsigned total = ab.contactCount();
    for (unsigned int i = 0; i < total; i++) {
      contacts.push_back(ab.getContact(i));
      int percent = i * 100 / total;
      progress.Send(reinterpret_cast<const char*>(&percent), sizeof(int));
    }
  }

  void HandleProgressCallback(const char* data, size_t size) {
    Nan::HandleScope scope;

    v8::Local<v8::Value> argv[] = {New<v8::Integer>(*reinterpret_cast<int*>(const_cast<char*>(data)))};
    progress->Call(1, argv);
  }

  // We have the results, and we're back in the event loop.
  void HandleOKCallback() {
    Isolate* isolate = Isolate::GetCurrent();
    Nan::HandleScope scope;

    Local<Array> results = New<Array>(contacts.size());
    int i = 0;

    for_each(contacts.begin(), contacts.end(), [&](Person* person) {
      Local<Object> contact = Object::New(isolate);
      fillPersonObject(isolate, contact, person);
      Nan::Set(results, i, contact);
      i++;
    });

    Local<Value> argv[] = {results};
    callback->Call(1, argv);
  }

 private:
  Callback* progress;
  vector<Person*> contacts;
};

// Asynchronous access to the `getContacts()` function
NAN_METHOD(GetContacts) {
  Callback* progress = new Callback(info[0].As<Function>());
  Callback* callback = new Callback(info[1].As<Function>());

  AsyncQueueWorker(new AddressBookWorker(callback, progress));
}

NAN_METHOD(GetMe) {
  AddressBook ab;
  Isolate* isolate = Isolate::GetCurrent();

  Local<Object> me = Object::New(isolate);
  fillPersonObject(isolate, me, ab.getMe());

  info.GetReturnValue().Set(me);
}

NAN_METHOD(GetContact) {
#if defined(V8_MAJOR_VERSION) && V8_MAJOR_VERSION >= 7
  unsigned int index = info[0]->Uint32Value(Nan::GetCurrentContext()).ToChecked();
#else
  unsigned int index = info[0]->Uint32Value();
#endif

  AddressBook ab;
  Isolate* isolate = Isolate::GetCurrent();
  Person* person = ab.getContact(index);

  if (person == NULL) {
    person = new Person();
  }

  Local<Object> contact = Object::New(isolate);
  fillPersonObject(isolate, contact, person);

  info.GetReturnValue().Set(contact);
}

NAN_METHOD(GetContactsCount) {
  AddressBook ab;
  info.GetReturnValue().Set((unsigned)ab.contactCount());
}

NAN_MODULE_INIT(Init) {
  Nan::Set(target, New<String>("getMe").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetMe)).ToLocalChecked());
  Nan::Set(target, New<String>("getContact").ToLocalChecked(),
           GetFunction(New<FunctionTemplate>(GetContact)).ToLocalChecked());
  Nan::Set(target, New<String>("getContactsCount").ToLocalChecked(),
           GetFunction(New<FunctionTemplate>(GetContactsCount)).ToLocalChecked());
  Nan::Set(target, New<String>("getContacts").ToLocalChecked(),
           GetFunction(New<FunctionTemplate>(GetContacts)).ToLocalChecked());
}

NODE_MODULE(addon, Init)
