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

#include <node.h>
#include "AddressBook.h"

using namespace v8;

void setStringArray(Isolate* isolate, Local<Object> obj, const char* name, const stringvector& src)
{
	Local<Array> array = Array::New(isolate);
	for (unsigned int i = 0; i < src.size(); i++ ) {
		Local<String> result = String::NewFromUtf8(isolate, src[i].c_str());
		array->Set(i, result);
	}	
	obj->Set(String::NewFromUtf8(isolate, name), array);
}

void fillPersonObject(Isolate* isolate, Local<Object> obj, Person *person)
{
	obj->Set(String::NewFromUtf8(isolate, "firstName"),
		String::NewFromUtf8(isolate, person->firstName().c_str()));
	obj->Set(String::NewFromUtf8(isolate, "lastName"),
		String::NewFromUtf8(isolate, person->lastName().c_str()));

	setStringArray(isolate, obj, "emails", person->emails());
	setStringArray(isolate, obj, "numbers", person->numbers());
}

void fillContactArray(Isolate* isolate, Local<Object> parent, AddressBook& ab)
{
	Local<Array> array = Array::New(isolate);
	for (unsigned int i = 0; i < ab.contactCount(); i++ ) {
		Local<Object> contact = Object::New(isolate);
		Person *p = ab.getContact(i);
		fillPersonObject(isolate, contact, p);
		delete p;
		array->Set(i, contact);
	}	
	parent->Set(String::NewFromUtf8(isolate, "contacts"), array);
}

void GetMe(const FunctionCallbackInfo<Value>& args)
{
	AddressBook ab;
	Isolate* isolate = args.GetIsolate();

	Local<Object> me = Object::New(isolate);
	fillPersonObject(isolate, me, ab.getMe());
	
	args.GetReturnValue().Set(me);
}

void ContactCount(const FunctionCallbackInfo<Value>& args)
{
	AddressBook ab;
	Isolate* isolate = args.GetIsolate();

	Local<Integer> c = Integer::New(isolate, ab.contactCount());
	
	args.GetReturnValue().Set(c);
}

void GetContact(const FunctionCallbackInfo<Value>& args)
{
	AddressBook ab;
	Isolate* isolate = args.GetIsolate();

	if (args.Length() < 1) {
		// Throw an Error that is passed back to JavaScript
		isolate->ThrowException(Exception::TypeError(
		String::NewFromUtf8(isolate, "Wrong number of arguments")));
		return;
	}

	// Check the argument types
	if (!args[0]->IsNumber()) {
		isolate->ThrowException(Exception::TypeError(
		String::NewFromUtf8(isolate, "Wrong argument type")));
		return;
	}

	// Perform the operation
	int64_t i = args[0]->IntegerValue();

	Local<Object> contact = Object::New(isolate);
	Person *p = ab.getContact(i);
	fillPersonObject(isolate, contact, p);
	delete p;

	args.GetReturnValue().Set(contact);
}

void CreateObject(const FunctionCallbackInfo<Value>& args)
{
	AddressBook ab;
	Isolate* isolate = args.GetIsolate();

	Local<Object> exports = Object::New(isolate);
	Local<Object> me = Object::New(isolate);
	fillPersonObject(isolate, me, ab.getMe());
	
	exports->Set(String::NewFromUtf8(isolate, "me"), me);
	fillContactArray(isolate, exports, ab);

	NODE_SET_METHOD(exports, "getMe", GetMe);
	NODE_SET_METHOD(exports, "contactCount", ContactCount);
	NODE_SET_METHOD(exports, "getContact", GetContact);
	args.GetReturnValue().Set(exports);
}


void init(Local<Object> exports, Local<Object> module)
{
	NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(addon, init)

