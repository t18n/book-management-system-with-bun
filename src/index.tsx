import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { db } from "./db";
import { books } from "./db/schema";
import { eq } from "drizzle-orm";
import { Book, BookList } from './components/book';
import { BaseHtml } from './components/base';

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <body
          class="flex w-full h-screen justify-center items-center"
          hx-get="/books"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </BaseHtml>
    )
  )
  .get("/books", async () => {
    const data = await db.select().from(books).all();
    console.log('data', data);
    return <BookList books={data} />;
  })
  .post(
    "/books/toggle/:id",
    async ({ params }) => {
      const oldTodo = await db
        .select()
        .from(books)
        .where(eq(books.id, params.id))
        .get();
      const newTodo = await db
        .update(books)
        .set({ completed: !oldTodo?.completed })
        .where(eq(books.id, params.id))
        .returning()
        .get();
      return <Book {...newTodo} />;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .delete(
    "/books/:id",
    async ({ params }) => {
      await db.delete(books).where(eq(books.id, params.id)).run();
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    "/books",
    async ({ body }) => {
      if (body.title.length === 0) {
        throw new Error("Title cannot be empty");
      }
      const newTodo = await db.insert(books).values(body).returning().get();
      return <Book {...newTodo} />;
    },
    {
      body: t.Object({
        title: t.String(),
      }),
    }
  )
  .listen(3000);

console.log(`🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`);
