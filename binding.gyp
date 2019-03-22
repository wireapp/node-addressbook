{
  "targets": [
    {
      "target_name": "electron-addressbook",
      "sources": [
        "src/cpp/AddressBook.cc",
        "src/cpp/Person.cc",
        "src/cpp/wrapper.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
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

