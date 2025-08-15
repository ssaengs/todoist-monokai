import mongoose from 'mongoose';

export interface ITodo {
  title: string;
  completed: boolean;
  priority: number;
  notes: string;
  media: string[];
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

const TodoSchema = new mongoose.Schema<ITodo>({
  title: {
    type: String,
    required: [true, 'Please provide a title for this todo.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  notes: {
    type: String,
    default: '',
  },
  media: [{
    type: String,
  }],
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);
