import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '@/types/todo';

export async function GET() {
  const todos = db.get('todos').value();
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newTodo: Todo = {
    id: uuidv4(),
    title: body.title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  db.get('todos').push(newTodo).write();
  return NextResponse.json(newTodo, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updateData } = body;
  db.get('todos')
    .find({ id })
    .assign(updateData)
    .write();
  return NextResponse.json({ message: 'Updated successfully' });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }
  db.get('todos')
    .remove({ id })
    .write();
  return NextResponse.json({ message: 'Deleted successfully' });
} 