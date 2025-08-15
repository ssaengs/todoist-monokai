import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }
    
    const body = await request.json();
    
    const todo = await Todo.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error('PUT /api/todos/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }
    
    const todo = await Todo.findByIdAndDelete(params.id);

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
