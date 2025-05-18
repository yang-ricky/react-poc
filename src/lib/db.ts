import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { join } from 'path';
import { Todo } from '@/types/todo';

type Schema = {
  todos: Todo[];
};

const adapter = new FileSync<Schema>(join(process.cwd(), 'db.json'));
const db = low(adapter);

// Set default data
db.defaults({ todos: [] }).write();

export default db; 