# MdBook Github Action with Plugin Support

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_action-mdbook&metric=coverage)](https://sonarcloud.io/summary/new_code?id=UsingPython_action-mdbook) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_action-mdbook&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=UsingPython_action-mdbook) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_action-mdbook&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=UsingPython_action-mdbook) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_action-mdbook&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=UsingPython_action-mdbook)
[![GitHub license](https://img.shields.io/github/license/jontze/action-mdbook)](https://github.com/jontze/action-mdbook/blob/master/LICENSE) [![GitHub issues](https://img.shields.io/github/issues/jontze/action-mdbook)](https://github.com/jontze/action-mdbook/issues)

## Introduction

This is an GitHub Action to set up the [rust-lang/mdBook](https://github.com/rust-lang/mdBook) with some [supported plugins](#supported-plugins).

This action runs only on linux and is well tested on GitHubs **latest ubuntu** runner and **compatible with Node v18 and v20**. Windows and MacOS are not supported.

## Supported Plugins

- [Michael-F-Bryan/mdbook-linkcheck](https://github.com/Michael-F-Bryan/mdbook-linkcheck)
- [badboy/mdbook-mermaid](https://github.com/badboy/mdbook-mermaid)
- [badboy/mdbook-toc](https://github.com/badboy/mdbook-toc)
- [badboy/mdbook-open-on-gh](https://github.com/badboy/mdbook-open-on-gh)
- [tommilligan/mdbook-admonish](https://github.com/tommilligan/mdbook-admonish)
- [lzanini/mdbook-katex](https://github.com/lzanini/mdbook-katex)

## Fast Setup

The following example installs mdbook with all currently supported plugins with the **latest version**. Keep in mind that this build **could break** if mdbook or one of the plugins release **new versions with breaking changes**. Therefore it is highly recommended to specify a version. See ["Advanced Setup"](#advanced-setup) for more information.

```yaml
name: Setup mdBook with plugins (latest)
on:
  push:
    branches:
      - main
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jontze/action-mdbook@v3
        with:
          token: ${{secrets.GITHUB_TOKEN}}
          # Optional Plugins have to be enabled
          use-linkcheck: true
          use-mermaid: true
          use-toc: true
          use-opengh: true
          use-admonish: true
          use-katex: true
      - name: Show mdbook version
        run: mdbook --version
      - name: Show linkchecker version
        run: mdbook-linkcheck --version
      - name: Show mermaid version
        run: mdbook-mermaid --version
      - name: Show toc version
        run: mdbook-toc --version
      - name: Show open-on-gh version
        run: mdbook-open-on-gh --version
      - name: Show admonish version
        run: mdbook-admonish --version
      - name: Show katex version
        run: mdbook-katex --version
```

## Advanced Setup

```yaml
name: Setup mdBook wth plugins (version)
on:
  push:
    branches:
      - main
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jontze/action-mdbook@v3
        with:
          token: ${{secrets.GITHUB_TOKEN}}
          # Optional Plugins have to be enabled with a version
          mdbook-version: "~0.3.0" # Use a semver compatible string
          use-linkcheck: true
          linkcheck-version: "~0.7.0"
          use-mermaid: true
          mermaid-version: "~0.8.0"
          use-toc: true
          toc-version: "~0.7.0"
          use-opengh: true
          opengh-version: "~2.0.0"
          use-admonish: true
          admonish-version: "~1.8.0"
          use-katex: true
          admonish-version: "~0.2.17"
      - name: Show mdbook version
        run: mdbook --version
      - name: Show linkchecker version
        run: mdbook-linkcheck --version
      - name: Show mermaid version
        run: mdbook-mermaid --version
      - name: Show toc version
        run: mdbook-toc --version
      - name: Show open-on-gh version
        run: mdbook-open-on-gh --version
      - name: Show admonish version
        run: mdbook-admonish --version
      - name: Show katex version
        run: mdbook-katex --version
```

## Contributions

Contributions are welcomed. Please take a look at the [Pull Request Template](.github/pull_request_template.md).
