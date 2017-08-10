import test from "blue-tape";
import { Phonebook } from "./index";
import Fs from "fs-extra";
// import { fetchContacts } from "./utils";

// Test data
const filePath = "./temp/contacts-test.json";

const demoObject = {
	firstName: "Andrew",
	lastName: "Appleby",
	type: "Work",
	number: "111-111-1111"
};

// Utilities
function createTestFile(filePath) {
	return Fs.open(filePath, "w").then(Fs.close);
}

function checkFileExists(filePath) {
	return Fs.access(filePath, Fs.constants.R_OK | Fs.constants.W_OK);
}

function writeDemoData(filePath, data) {
	return Fs.writeFile(filePath, JSON.stringify(data));
}

function readDemoData(filePath) {
	return Fs.readFile(filePath).then(data => JSON.parse(data));
}

// Tests
test("Can create a json file", t => {
	t.pass(`File ${filePath} exists`);

	return createTestFile(filePath)
		.then(() => {
			return checkFileExists(filePath);
		})
		.then(err => {
			t.ok(!err);
		})
		.catch(t.fail);
});

test("Can write and read json file", t => {
	t.pass(`File ${filePath} was written to`);

	return writeDemoData(filePath, demoObject)
		.then(() => {
			return readDemoData(filePath);
		})
		.then(data => {
			t.deepEqual(data, demoObject, "Is equal????");
		})
		.catch(t.fail);
});
