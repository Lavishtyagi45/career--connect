import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  code: String,
  language: String,
  results: Array,
  passedCount:Number,
  totalCount:Number
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
