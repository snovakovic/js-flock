- removed assertion from to enum
- toEnum does not muteate input
- promisify don't accept mutate and always mutate module
- promisify.all does not mutate input options object

## [1.4.0] - 2017-07-19
### Added
- deepPreventExtensions
### Changed
- Added options { proto: true } in deep (seal, freeze, preventExtensions) that instructs deep
to loop over prototype chain.

## [1.3.0] - 2017-07-18
### Fixed
- Fixed promisified function to preserve this.

## [1.2.0] - 2017-07-17
### Changed
- Promisify all now accepts mutate option which determines if target module will be mutated. Default value is false to compatible with current behavior.

## [1.1.0] - 2017-07-17
### Added
- promisify.all

## [1.0.0] - 2017-07-11
### Changed
- Updated sort to remove check if sortBy exists
- Modules are now required in root. e.g js-flock/toEnum instead of js-flock/src/toEnum
- Added option to load ES5 transpiled modules. e.g js-flock/es5/toEnum or js-flock/es5/toEnum.min

## [0.10.0] - 2017-07-05
### Changed
- Changed enum short notation to create enum with Symbol

## [0.9.0] - 2017-06-02
### Changed
- Add validation(assertion) to enum

## [0.8.0] - 2017-06-27
### Changed
- Singular method emits done as first parameter not last
- Singular method is preserving this

## [0.7.0] - 2017-06-27
### Added
- added singular method

## [0.6.0] - 2017-06-21
### Changed
- handling of helper methods in toEnum
- helper methods are not included into keys, values calculation
- lazy loading of helper keys, values (improve performance)

## [0.5.0] - 2017-06-15
### Added
- option { multiArgs: true } in promisify to resolve multiple params
- test cases
### fixed
- integration test

## [0.4.0] - 2017-06-12
### Added
- sort utility method
