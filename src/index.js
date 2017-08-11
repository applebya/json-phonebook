import Fs from "fs-extra";

class Phonebook {
	constructor(filePath = "./src/contacts.json") {
		this.filePath = filePath;

		// checkFileExists(filePath).then(exists => {
		// 	return this.fetchAll();
		// });
	}

	fetchAll() {
		return Fs.readFile(this.filePath).then(json => JSON.parse(json));
	}

	fetchByNameType() {
		return this.fetchAll().then();
	}

	deleteContactWithId(id) {
		return this.fetchAll()
			.then(data => {
				return data.filter(c => c.id !== id);
			})
			.then(contacts => {
				return Fs.writeFile(this.filePath, JSON.stringify(contacts));
			});
	}

	addContact(contact) {
		// TODO: Shape check
		let newContacts;

		return this.fetchAll()
			.then(originalContacts => [...originalContacts, contact])
			.then(contacts => {
				newContacts = contacts;
				return Fs.writeFile(this.filePath, JSON.stringify(newContacts));
			})
			.then(() => newContacts);
	}
}

function checkFileExists(filePath) {
	return Fs.access(filePath, Fs.constants.R_OK | Fs.constants.W_OK).then(err => {
		if (err) {
			throw new Error(`File path not found ${filePath}`);
			return false;
		}

		return true;
	});
}

export default Phonebook;
