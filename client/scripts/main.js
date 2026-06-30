// src/main.js
import { mount } from "svelte";
import App from "./app.svelte";

const targetElement = document.getElementById("app");

// SIGNAL RECEIVER: Entry point for the application.
// No side effects occur here; this purely mounts the app structure.
const app = mount(App, {
  target: targetElement,
});

export default app;
