# Security policy

## Reporting a vulnerability

Please don't open a public issue for security problems.

Report privately through GitHub: go to the repository's **Security** tab and choose **Report a vulnerability**. Include what's affected, how to reproduce it, and the impact you expect.

You should get a first response within a week. Once a fix is ready, the report is published as a GitHub security advisory with credit to you, unless you'd rather stay anonymous.

## Scope

- The scene components in `components/scenes/`, which people copy into their own projects.
- The documentation site (`app/`, `components/site/`, `lib/`) and its generated files (`/llms.txt`, `/llms-full.txt`, `/scenes/<name>.md`).

## Supported versions

Only the latest commit on `main` is supported. Scenes are copied into projects rather than installed, so fixes are applied by copying the updated files.
