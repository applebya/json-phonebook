import test from "blue-tape";
import Phonebook from "./index";
import Fs from "fs-extra";

const filePath = "./temp/contacts-test.json";
const seedsFilePath = "./src/contacts-seeds.json";

test("Creates a class instance with specified filePath", t => {
	let phonebook = new Phonebook(filePath);

	t.ok(phonebook.filePath === filePath);
	t.end();
});

test("Loads contact list array from json file", t => {
	let phonebook = new Phonebook(filePath);

	return phonebook
		.fetchAll()
		.then(contacts => {
			t.ok(contacts instanceof Array);
		})
		.catch(t.fail);
});

test("Imports and maps data from supplied JSON file", t => {
	let phonebook = new Phonebook(filePath);

	return phonebook.importContactsFrom(seedsFilePath).then(contacts => {
		t.ok(contacts instanceof Array);
	});
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
	let phonebook = new Phonebook(filePath);

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

const getOrderedContacts = (t, nameType, orderType) => {
	let phonebook = new Phonebook(filePath);

	return phonebook.fetchByNameType(nameType);
};

test("Fetches contacts and orders them by firstName ascending", t =>
	getOrderedContacts(t, "firstName", "asc").then(ordered => {
		// Check first 3 for ordering
		t.ok(ordered[0].firstName.toUpperCase() <= ordered[1].firstName.toUpperCase());
		t.ok(ordered[1].firstName.toUpperCase() <= ordered[2].firstName.toUpperCase());
		t.ok(ordered[2].firstName.toUpperCase() <= ordered[3].firstName.toUpperCase());
	}));

test("Fetches contacts and orders them by lastName descending", t =>
	getOrderedContacts(t, "lastName", "desc").then(ordered => {
		// Check first 3 for ordering
		t.ok(ordered[0].firstName.toUpperCase() >= ordered[1].firstName.toUpperCase());
		t.ok(ordered[1].firstName.toUpperCase() >= ordered[2].firstName.toUpperCase());
		t.ok(ordered[2].firstName.toUpperCase() >= ordered[3].firstName.toUpperCase());
	}));
