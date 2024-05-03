import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  ans_type: {
    type: String,
    required: true,
    enum: ["mcq", "dropdown", "checkbox", "short_ans", "long_ans"],
  },
  ans: { type: String },
  optionsArray: {
    type: [String],
    validate: {
      validator: function (value) {
        if (
          ["mcq", "dropdown", "checkbox"].includes(this.ans_type) &&
          (!Array.isArray(value) || value.length === 0)
        ) {
          return false;
        }
        return true;
      },
      message: (props) =>
        `optionsArray must have at least one element for 'mcq', 'dropdown', or 'checkbox' types`,
    },
  },
  title: {
    type: String,
    required: true,
  },
  files: [String]
});

const formSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    //   required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    //   required: true,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (arr) {
          // Check if the questions array has at least one element
          return arr && arr.length > 0;
        },
        message: "At least one question is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

const SubmittedForm = mongoose.model("Form", formSchema);

export default SubmittedForm;
