import test from "blue-tape";
import Phonebook from "./index";
import Fs from "fs-extra";

const filePath = "./temp/contacts-test.json";

test("Creates a class instance with specified filePath", t => {
	let phonebook = new Phonebook(filePath);

	t.ok(phonebook.filePath === filePath);
	t.end();
});

// test("Can't create class instance with invalid filePath", t => {
// 	let phonebook = new Phonebook("./doesnotexist.json");

// 	t.ok(phonebook.filePath === filePath);
// 	t.end();
// });

test("Loads contact list array from json file", t => {
	let phonebook = new Phonebook(filePath);

	return phonebook
		.fetchAll()
		.then(contacts => {
			t.ok(contacts instanceof Array);
		})
		.catch(t.fail);
});

test("Writes a new contact to the json file", t => {
	let phonebook = new Phonebook(filePath);

	const contact = {
		firstName: "Tucan",
		lastName: "Sam",
		phoneNumber: "111-111-1111",
		phoneType: "Cellular",
		timestamp: "June 12,2017" // TODO: Better timestamp
	};

	// const expected = JSON.parse(Fs.readFileSync(filePath));
	let allContacts;

	return phonebook
		.fetchAll()
		.then(contacts => {
			allContacts = contacts;
		})
		.then(() => phonebook.addContact(contact))
		.then(newContacts => {
			const appendedContact = newContacts[newContacts.length - 1];
			t.deepEqual(contact, appendedContact);
		});
});

test("Deletes a specific object from the list", t => {
	let Phonebook = new Phonebook(filePath);
});
