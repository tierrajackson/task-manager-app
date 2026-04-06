import React, { useEffect, useMemo, useState } from "react";
import { Check, Plus, Trash2, ListTodo } from "lucide-react";

type Filter = "all" | "active" | "completed";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "task-manager-app-tasks";

export default function TaskManagerApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Task[];
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage", error);
    }
  }, [tasks]);

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white shadow-sm">
              <ListTodo className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Task Manager App</h1>
              <p className="mt-1 text-sm text-slate-600">
                A polished React project for your portfolio with filtering and saved state.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
              placeholder="Add a new task..."
              className="h-12 flex-1 rounded-2xl border border-slate-300 px-4 text-base outline-none transition focus:border-slate-900"
            />
            <button
              onClick={addTask}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 font-medium text-white transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["all", "active", "completed"] as Filter[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                    filter === option
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span>{activeCount} active</span>
              <span>{completedCount} completed</span>
              {completedCount > 0 && (
                <button
                  onClick={clearCompleted}
                  className="font-medium text-slate-900 underline underline-offset-4"
                >
                  Clear completed
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                <p className="text-slate-600">
                  No tasks here yet. Add one above to get started.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                      task.completed
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-500 hover:border-slate-500"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-base font-medium ${
                        task.completed ? "text-slate-400 line-through" : "text-slate-900"
                      }`}
                    >
                      {task.text}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Created {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
