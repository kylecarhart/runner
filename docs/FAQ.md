# FAQ

## Type instantiation is excessively deep and possibly infinite.

Make sure the same version of zod is used in all packages.

## Turbo build works locally but not in CI

Delete any dist folders and use `--force` with the turbo run command to try and replicate. If you can replicate, then you probably have an issue with your turbo dependencies.
