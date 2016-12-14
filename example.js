const readline = require('readline');
const colors = require('colors');
colors.setTheme({
    custom: ['red', 'underline']
});

const addressBook = require('./index');

console.log("Me: ".custom, addressBook.getMe());

console.log("Contact [1]: ".custom, addressBook.getContact(1));

console.log("Number of Contacts: ".custom, addressBook.getContactsCount());

console.log("Start Importing Contacts".custom);

addressBook.getContacts(
    progress => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write("Progress".custom + " " + progress + "%")
    },
    contacts => console.log("Contacts".custom, contacts)
);