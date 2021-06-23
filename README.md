# mdBook Github Action with Plugin Support

## Introduction

This is an action to set up the rust-lang/mdBook with the mdbook-linkchecker plugin.

This Action runs only on linux and is well tested on ubuntu-20.04. Further releases may will support macOS, but no windows support is planned.

## Fast Setup

The following example installs mdbook and the linkchecker plugin with the **latest version**. Keepin mind that this build **could break** if mdbook or linkchecker release new **versions with breaking changes**. Therefore it is highly recommended to specify a version. See ["Advanced Setup"](#advanced-setup) for more information.

```yaml
name: Setup mdBook with linkchecker plugin
on:
  push:
    branches:
      - master
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: UsingPython/action-mdbook@1
        with:
          token: ${{secrets.GITHUB_TOKEN}}
          use-linkcheck: true # Optional if you want to enable the plugin
      - name: Show mdbook version
        run: mdbook --version
      - name: Show linkchecker version
        run: mdbook-linkcheck --version
```

## Advanced Setup

```yaml
name: Setup mdBook with linkchecker plugin in specific version
on:
  push:
    branches:
      - master
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: UsingPython/action-mdbook@1
        with:
          token: ${{secrets.GITHUB_TOKEN}}
          mdbook-version: "~0.3.0" # Use a semver compatible string
          use-linkcheck: true # Optional if you want to enable the plugin
          linkcheck-version: "~0.7.0" # Use a semver compatible string
      - name: Show mdbook version
        run: mdbook --version
      - name: Show linkchecker version
        run: mdbook-linkcheck --version
```

## Contributions

Contributions are welcomed. Please take a look at the [Pull Request Guidelines](.github/pull_request_template.md).
