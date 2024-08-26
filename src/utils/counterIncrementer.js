const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
	id: { type: String, required: true },
	seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const incrementCounter = async (counterName) => {
	const counter = await Counter.findOneAndUpdate(
		{ id: counterName },
		{ $inc: { seq: 1 } },
		{ new: true, upsert: true }
	);
	return counter.seq;
};

module.exports = incrementCounter;
