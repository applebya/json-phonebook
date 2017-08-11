import test from "blue-tape";
import Phonebook from "./index";
import Fs from "fs-extra";

const filePath = "./temp/contacts-test.json";
const seedsFilePath = "./src/contacts-seeds.json";

let phonebook = new Phonebook(filePath);

test("Creates a class instance with specified filePath", t => {
	t.ok(phonebook.filePath === filePath);
	t.end();
});

test("Loads contact list array from json file", t => {
	return phonebook
		.fetchAll()
		.then(contacts => {
			t.ok(contacts instanceof Array);
		})
		.catch(t.fail);
});

test("Imports and maps data from supplied JSON file", t => {
	return phonebook.importContactsFrom(seedsFilePath).then(contacts => {
		t.ok(contacts instanceof Array);
	});
});

test("Writes a new contact to the json file", t => {
	const contact = {
		firstName: "Tucan",
		lastName: "Sam",
		phoneNumber: "111-111-1111",
		phoneType: "Cellular",
		timestamp: "June 12,2017" // TODO: Better timestamp
	};

	let allContacts;

	return phonebook
		.fetchAll()
		.then(contacts => {
			allContacts = contacts;
			return phonebook.addContact(contact);
		})
		.then(newContacts => {
			const appendedContact = newContacts[newContacts.length - 1];
			t.deepEqual(contact, appendedContact);
			return;
		})
		.then(() => contact);
});

test("Edits an existing contact", t => {
	let editedContact,
		index = 2;

	return phonebook
		.fetchAll()
		.then(contacts => {
			editedContact = Object.assign({}, contacts[index], {
				firstName: "Bob",
				lastName: "Marley"
			});
			return phonebook.editContact(editedContact);
		})
		.then(newContacts => {
			t.deepEqual(newContacts[index], editedContact);
		});
});

test("Deletes a specific object from the list", t => {
	let allContacts;

	return phonebook
		.fetchAll()
		.then(contacts => {
			allContacts = contacts;
			return phonebook.deleteById(allContacts[0].id);
		})
		.then(newContacts => {
			const expected = allContacts.length - 1;
			const actual = newContacts.length;

			t.equals(expected, actual);
			t.ok(newContacts[0].id !== allContacts[0].id);
			t.ok(newContacts[0].id === allContacts[1].id);
		});
});

test("Fetches contacts and orders them by firstName ascending", t =>
	phonebook.fetchByNameType("firstName", "asc").then(ordered => {
		// Check first 3 for ordering
		t.ok(ordered[0].firstName.toUpperCase() <= ordered[1].firstName.toUpperCase());
		t.ok(ordered[1].firstName.toUpperCase() <= ordered[2].firstName.toUpperCase());
		t.ok(ordered[2].firstName.toUpperCase() <= ordered[3].firstName.toUpperCase());
	}));

test("Fetches contacts and orders them by lastName descending", t =>
	phonebook.fetchByNameType("lastName", "desc").then(ordered => {
		// Check first 3 for ordering
		t.ok(ordered[0].lastName.toUpperCase() >= ordered[1].lastName.toUpperCase());
		t.ok(ordered[1].lastName.toUpperCase() >= ordered[2].lastName.toUpperCase());
		t.ok(ordered[2].lastName.toUpperCase() >= ordered[3].lastName.toUpperCase());
	}));

test("Filters contacts by name, type, or number", t => {
	const keyword = "er";
	let allContacts;

	return phonebook
		.fetchAll()
		.then(contacts => {
			allContacts = contacts;

			return phonebook.fetchByKeyword("er");
		})
		.then(matches => {
			t.ok(matches.length > 0);
			t.ok(matches.length < allContacts.length);
		});
});
