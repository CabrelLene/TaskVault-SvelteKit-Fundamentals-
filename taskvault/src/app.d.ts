// See https://svelte.dev/docs/kit/types#app
declare global {
  namespace App {
    interface Locals {
      user: { id: string; email: string } | null;
    }
  }
}

export {};
