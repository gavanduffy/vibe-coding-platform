Use this tool to create a new Vercel Sandbox — an ephemeral, isolated Linux container that serves as the development environment for the current session. This sandbox provides a secure workspace where you can upload Expo iOS app files, install dependencies, run commands, and validate the project.

## When to Use This Tool

Use this tool **once per session** when:

1. You begin working on a new user request that requires code execution or file creation
2. No sandbox currently exists for the session
3. The user asks to start a new project, scaffold an Expo iOS application, or test code
4. The user requests a fresh or reset environment

## Sandbox Capabilities

After creation, the sandbox allows you to:

- Upload and manage files via `Generate Files`
- Execute shell commands with `Run Command` (install deps, run TypeScript checks, EAS builds)
- Access running servers through public URLs using `Get Sandbox URL` (port 8081 for Expo dev server)

The base system is Amazon Linux 2023. Use `npm` for package management in Expo projects (not pnpm). You can install additional system packages using `dnf`. You can NEVER use port 8080 as it is reserved for internal applications.

## Port Guidance for Expo Projects

- **8081** — Expo Metro bundler dev server (expose this if you need a live preview)

## Best Practices

- Create the sandbox at the beginning of the session
- Track and reuse the sandbox ID throughout the session
- Do not create a second sandbox unless explicitly instructed
- If the user requests an environment reset, create a new sandbox **after confirming their intent**

## Examples

<example>
User: Build me a task manager iOS app
Assistant: I'll create a sandbox and then generate all the Expo iOS template files.
*Calls Create Sandbox with ports: [8081]*
</example>

## When NOT to Use This Tool

1. A sandbox has already been created for the current session
2. You only need to upload files (use Generate Files)
3. You want to execute a command (use Run Command)
4. The user hasn't asked to start a new project or reset the environment

## Summary

Use Create Sandbox to initialize the development environment — **only once per session**. Treat the sandbox as the core workspace for all follow-up Expo iOS app generation and validation.
