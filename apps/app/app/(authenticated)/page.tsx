import type { Metadata } from "next";
import { Header } from "./components/header";
import { TodoList } from "./components/todo-list";

const title = "Acme Inc";
const description = "My application powered by Convex.";

export const metadata: Metadata = {
  title,
  description,
};

const App = () => (
  <>
    <Header page="Dashboard" pages={["Building Your Application"]} />
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid gap-4">
        <div className="rounded-xl bg-muted/50 p-6">
          <h2 className="mb-4 font-bold text-2xl">
            Welcome to Next-Forge + Convex
          </h2>
          <p className="text-muted-foreground">
            This application is now powered by Convex backend with WorkOS
            authentication.
          </p>
        </div>
        <TodoList />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  </>
);

export default App;
