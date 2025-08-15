import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { todos } = body;

    if (!Array.isArray(todos)) {
      return NextResponse.json({ error: 'Todos array is required' }, { status: 400 });
    }

    // Update all todos with their new order
    const updatePromises = todos.map((todo: any, index: number) => 
      Todo.findByIdAndUpdate(todo._id, { order: index })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Todos reordered successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder todos' }, { status: 500 });
  }
}
