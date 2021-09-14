# MdBook Github Action with Plugin Support

## Introduction

This is an action to set up the [rust-lang/mdBook](https://github.com/rust-lang/mdBook) with some [supported plugins](#supported-plugins).

This Action runs only on linux and is well tested on ubuntu-20.04. Further releases may will support macOS, but no windows support is planned.

## Supported Plugins

- [Michael-F-Bryan/mdbook-linkcheck](https://github.com/Michael-F-Bryan/mdbook-linkcheck)
- [badboy/mdbook-mermaid](https://github.com/badboy/mdbook-mermaid)

## Fast Setup

The following example installs mdbook with all currently supported plugins with the **latest version**. Keep in mind that this build **could break** if mdbook or one of the plugins release **new versions with breaking changes**. Therefore it is highly recommended to specify a version. See ["Advanced Setup"](#advanced-setup) for more information.

```yaml
name: Setup mdBook with plugins (latest)
on:
  push:
    branches:
      - master
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: jontze/action-mdbook@v1
        with:
          token: ${{secrets.GITHUB_TOKEN}}
          # Optional Plugins have to be enabled
          use-linkcheck: true
          use-mermaid: true
      - name: Show mdbook version
        run: mdbook --version
      - name: Show linkchecker version
        run: mdbook-linkcheck --version
      - name: Show mermaid version
        run: mdbook-mermaid --version
```

## Advanced Setup

```yaml
name: Setup mdBook wth plugins (version)
on:
  push:
    branches:
      - master
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: jontze/action-mdbook@v1
        with:
          token: ${{secrets.GITHUB_TOKEN}}
          # Optional Plugins have to be enabled with a version
          mdbook-version: "~0.3.0" # Use a semver compatible string
          use-linkcheck: true
          linkcheck-version: "~0.7.0"
          use-mermaid: true
          mermaid-version: "~0.8.0"
      - name: Show mdbook version
        run: mdbook --version
      - name: Show linkchecker version
        run: mdbook-linkcheck --version
      - name: Show mermaid version
        run: mdbook-mermaid --version
```

## Contributions

Contributions are welcomed. Please take a look at the [Pull Request Template](.github/pull_request_template.md).
