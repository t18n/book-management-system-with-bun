import { Book } from "../db/schema";
import * as elements from "typed-html";

export function Book({ title, completed, id }: Book) {
  return (
    <tr class="space-x-5">
      <td>{title}</td>
      <td>
        <input
          type="checkbox"
          checked={completed}
          hx-post={`/books/toggle/${id}`}
          hx-swap="outerHTML"
          hx-target="closest tr"
        />
      </td>
      <td>
        <button
          class="text-red-500"
          hx-delete={`/books/${id}`}
          hx-swap="outerHTML"
          hx-target="closest tr"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export function BookList({ books }: { books: Book[] }) {
  return (
    <div>
      <AddBook />
      <table class="w-full text-left">
        <thead>
          <tr>
            <th>Books</th>
            <th>Completed</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {books.map((todo) => (
            <Book {...todo} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AddBook() {
  return (
    <form class="flex flex-row space-x-3 mb-4" hx-post="/books" hx-swap="beforebegin">
      <input type="text" name="title" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}
