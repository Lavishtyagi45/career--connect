import mongoose from "mongoose";

const testCaseSchema=new mongoose.Schema({
    input:{type:String},
    output:{type:String}
});

const questionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        domain: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'easy',
          },
          testCases: [testCaseSchema],
          solution: { type: String }, // Optional
    },
    { timestamps: true });
    
    const Question = mongoose.model("Question", questionSchema);
    export default Question;