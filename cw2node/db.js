const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = 'mongodb+srv://admin:admin@cluster0.none3.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});
var ObjectId = require('mongodb').ObjectId;
const dbLessons = client.db('lessons_shop');

async function search(searchString) {
	const client = await MongoClient.connect(uri);
	const dbLessons = client.db('lessons_shop');
	let allDocuments = await dbLessons
		.collection('lessons')
		.find({ $or: [ { topic: { $regex: searchString } }, { location: { $regex: searchString } } ] })
		.toArray();
	return allDocuments;
}
async function returnAllLessons() {
	const client = await MongoClient.connect(uri);
	const dbLessons = client.db('lessons_shop');
	let allDocuments = await dbLessons.collection('lessons').find().toArray();
	return allDocuments;
}
async function insertOrder(name, phoneNr, lessonId, spaces) {
	const client = await MongoClient.connect(uri);
	const dbLessons = client.db('lessons_shop');
	const objId = new ObjectId(lessonId);
	const insertOrder = await dbLessons
		.collection('orders')
		.insertOne({ name, phone: phoneNr, lessonId: objId, spaces });
	return insertOrder;
}
function updateLesson(lessondId, spaces) {
	client.connect(async (err) => {
		const objId = new ObjectId(lessondId);
		const updateLesson = await dbLessons
			.collection('lessons')
			.findOneAndUpdate({ _id: objId }, { $set: { space: spaces } });
		client.close();
		return updateLesson;
	});
}

module.exports = {
	search,
	returnAllLessons,
	insertOrder,
	updateLesson
};
