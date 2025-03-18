# Runner Frontend

## Environment Variables

Copy `.env.example` to `.env` and fill in the blanks.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Astro Inspect

The Inspect app provides information about any islands on the current page. This will show you the properties passed to each island, and the client directive that is being used to render them.

If the island overlay doesn't fully wrap the content, wrap the island in a div (within the island). Not sure if its a bug or not.
