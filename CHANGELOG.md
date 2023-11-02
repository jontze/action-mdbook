# [3.0.0](https://github.com/jontze/action-mdbook/compare/v2.2.2...v3.0.0) (2023-11-02)


* feat!: Update action to node v20 ([90691f4](https://github.com/jontze/action-mdbook/commit/90691f49e38acb1a11f33ef6cdc845a37780caac))


### BREAKING CHANGES

* The action will still work as before, but the move from Node v16 to v20
is considered as breaking.

## [2.2.2](https://github.com/jontze/action-mdbook/compare/v2.2.1...v2.2.2) (2023-09-11)


### Bug Fixes

* Prevent that executable is downloaded for incorrect architecture ([e054ff2](https://github.com/jontze/action-mdbook/commit/e054ff2232d508f1967e43e9df4aeab28ada4b89))

## [2.2.1](https://github.com/jontze/action-mdbook/compare/v2.2.0...v2.2.1) (2023-04-24)


### Bug Fixes

* **admonish:** Switch from gnu to musl binary to fix GLIBC version error ([f0f75f3](https://github.com/jontze/action-mdbook/commit/f0f75f322bdc8244767484a067811573be5e19c4))

# [2.2.0](https://github.com/jontze/action-mdbook/compare/v2.1.0...v2.2.0) (2023-02-08)


### Features

* **plugin:** Add support for the katex plugin ([7af14ca](https://github.com/jontze/action-mdbook/commit/7af14caae9ae0b0fdbc207a6456678060c858606)), closes [#301](https://github.com/jontze/action-mdbook/issues/301)

# [2.1.0](https://github.com/jontze/action-mdbook/compare/v2.0.0...v2.1.0) (2023-01-11)


### Bug Fixes

* **OpenGh:** Use musl binary to remove glibc dependency ([95967b2](https://github.com/jontze/action-mdbook/commit/95967b2dc954c913f15afddf8a3eb8d5d3033e4a))
* **toc:** Use musl binary to remove glibc dependency ([c807e4f](https://github.com/jontze/action-mdbook/commit/c807e4f5a8e9c3700324ce4bb5f362c0ec4fd496))


### Features

* **plugin:** Setup optional the admonish mdbook plugin ([5918865](https://github.com/jontze/action-mdbook/commit/591886551e2534905f2c956eaf502dcbe8666312)), closes [#300](https://github.com/jontze/action-mdbook/issues/300)

# [2.0.0](https://github.com/jontze/action-mdbook/compare/v1.1.1...v2.0.0) (2022-12-07)


* feat!: Update action to node v16 ([cde4bfc](https://github.com/jontze/action-mdbook/commit/cde4bfcda6fa6f6a644b908f2a3e44a4a8d6dd88)), closes [#285](https://github.com/jontze/action-mdbook/issues/285)


### BREAKING CHANGES

* Dropping support for node v12.

# [1.1.0](https://github.com/UsingPython/action-mdbook/compare/v1.0.2...v1.1.0) (2021-09-14)


### Features

* Add mdbook-mermaid preprocessor to supported action plugins ([1fc3b66](https://github.com/UsingPython/action-mdbook/commit/1fc3b66c7d53be5539b6436fe2c1dcfdc6dfe6a0))
* Add support of mdbook-open-on-gh plugin ([d538a3e](https://github.com/UsingPython/action-mdbook/commit/d538a3e4fd09d75de61605590ed6eda19ea3990e))
* Add support of mdbook-toc plugin ([6121751](https://github.com/UsingPython/action-mdbook/commit/6121751fe9422f37f0aa715c5882dccfe271a368))
* Enable toc and open-on-gh plugins ([c316e6c](https://github.com/UsingPython/action-mdbook/commit/c316e6cc7fb28c83ea3718f8c222c26848a358c6))

## [1.0.2](https://github.com/UsingPython/action-mdbook/compare/v1.0.1...v1.0.2) (2021-09-08)


### Bug Fixes

* Fix failing linkchecker if last release doesn't have a valid binary ([e1421b3](https://github.com/UsingPython/action-mdbook/commit/e1421b3fc2c3628f8f00f76e8ed419b066e4884d))

## [1.0.1](https://github.com/UsingPython/action-mdbook/compare/v1.0.0...v1.0.1) (2021-08-29)


### Bug Fixes

* Fix failing build due to missing catch type ([0f795bc](https://github.com/UsingPython/action-mdbook/commit/0f795bc3fb6cb5253ed53d5722145ba76572714b))

# 1.0.0 (2021-06-23)


### Features

* Trigger release v1.0.0 ([768d29a](https://github.com/UsingPython/action-mdbook/commit/768d29ac9789b32a4eb648511ef1475275984f21))
