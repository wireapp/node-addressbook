{
  "targets": [
    {
      "target_name": "electron-addressbook",
      "sources": [
        "AddressBook.cc",
        "Person.cc",
        "wrapper.cc"
      ],
      "include_dirs": [
      ],
      "conditions": [
        ['OS=="mac"', {
          "libraries": [
	    '$(SDKROOT)/System/Library/Frameworks/AddressBook.framework'
          ]
        }]
      ]
    }
  ],
}

