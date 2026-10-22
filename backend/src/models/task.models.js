import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedBy : {
    type: Schema.Types.ObjectId,
    ref : "User",
  },
  assignedTo : {
    type: Schema.Types.ObjectId,
    ref : "User",
  },
  status : {
    type : String,
    enum: AvailableTaskStatus,
    default: TaskStatusEnum.TODO,
  },
  attachments : {
    type: [{
        url: String,
        mimeType : String, 
        size: Number,
    }],
    default: []
  }
},{
    timestamps: true
});

export const Task = mongoose.model("Task", taskSchema);
