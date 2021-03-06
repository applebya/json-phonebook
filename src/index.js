import Fs from "fs-extra";
import RandomId from "random-id";

class Phonebook {
	constructor(filePath = "./src/contacts.json") {
		checkFileExists(filePath);
		this.filePath = filePath;
	}

	fetchAll() {
		return readFromJson(this.filePath);
	}

	fetchByNameType(nameType, orderType) {
		if (["firstName", "lastName"].indexOf(nameType) === -1) {
			throw new Error(`Unkown nameType: '${nameType}'`);
			return;
		}

		if (["asc", "desc"].indexOf(orderType) === -1) {
			throw new Error(`Unkown orderType type: '${orderType}'`);
			return;
		}

		return this.fetchAll().then(data => {
			let ordered = data.sort((a, b) => {
				let nameA = a[nameType].toUpperCase();
				let nameB = b[nameType].toUpperCase();

				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				return 0;
			});

			return orderType === "asc" ? ordered : ordered.reverse();
		});
	}

	fetchByKeyword(keyword = "") {
		return this.fetchAll().then(data =>
			data.filter(({ firstName, lastName, phoneNumber, phoneType }) =>
				[firstName, lastName, phoneNumber, phoneType].some(val => val.indexOf(keyword) > -1)
			)
		);
	}

	deleteById(id) {
		let newContacts;

		return this.fetchAll()
			.then(data => {
				return data.filter(c => c.id !== id);
			})
			.then(contacts => {
				newContacts = contacts;
				return Fs.writeFile(this.filePath, JSON.stringify(contacts));
			})
			.then(() => newContacts);
	}

	addContact(newContact) {
		// TODO: Shape check
		let newContacts;

		newContact.id = RandomId();

		return this.fetchAll()
			.then(originalContacts => [...originalContacts, newContact])
			.then(contacts => {
				newContacts = contacts;
				return Fs.writeFile(this.filePath, JSON.stringify(newContacts));
			})
			.then(() => newContacts);
	}

	editContact(editedContact) {
		// TODO: Shape check
		let newContacts;

		return this.fetchAll()
			.then(contacts =>
				contacts.map(contact => {
					if (contact.id === editedContact.id) {
						return editedContact;
					}

					return contact.id === editedContact.id ? editedContact : contact;
				})
			)
			.then(contacts => {
				newContacts = contacts;
				return Fs.writeFile(this.filePath, JSON.stringify(newContacts));
			})
			.then(() => newContacts);
	}

	importContactsFrom(filePath) {
		let allContacts;

		return readFromJson(filePath)
			.then(data =>
				data.map(contact =>
					// Add id, and exchange timestamp format for JS date
					Object.assign({}, contact, {
						id: RandomId(),
						timestamp: new Date(contact.timestamp)
					})
				)
			)
			.then(contacts => {
				allContacts = contacts;
				return Fs.writeFile(this.filePath, JSON.stringify(contacts));
			})
			.then(() => allContacts);
	}
}

function checkFileExists(filePath) {
	return Fs.access(filePath, Fs.constants.R_OK | Fs.constants.W_OK).then(err => {
		if (err) {
			throw new Error(`File path not found ${filePath}`);
			return false;
		}
	});
}

// TODO: writeToJson

function readFromJson(filePath) {
	return Fs.readFile(filePath).then(json => JSON.parse(json));
}

export default Phonebook;
