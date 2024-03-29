# Guess the Number

[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=berkerol_guess-the-number&metric=alert_status)](https://sonarcloud.io/dashboard?id=berkerol_guess-the-number)
[![CI](https://github.com/berkerol/guess-the-number/actions/workflows/lint.yml/badge.svg?branch=master)](https://github.com/berkerol/guess-the-number/actions/workflows/lint.yml)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/berkerol/guess-the-number/issues)
[![semistandard](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)
[![ECMAScript](https://img.shields.io/badge/ECMAScript-latest-brightgreen.svg)](https://www.ecma-international.org/ecma-262)
[![license](https://img.shields.io/badge/license-GNU%20GPL%20v3.0-blue.svg)](https://github.com/berkerol/guess-the-number/blob/master/LICENSE)

Try to find the number using various hints. Digits cannot repeat. Press _R_ to reset settings to defaults.

[![button](play.png)](https://berkerol.github.io/guess-the-number/gtn.html)

## Gameplay & Features

- Hints

  - number of digits

    - in correct and incorrect positions relative to the real number.
    - do not exist in the real number.

  - whether your guess is bigger or smaller than the real number.

  - sum of all digits in the real number.

- Make a random guess or give up.

## Continous Integration

It is setup using GitHub Actions in `.github/workflows/lint.yml`

## Contribution

Feel free to [contribute](https://github.com/berkerol/guess-the-number/issues) according to the [semistandard rules](https://github.com/Flet/semistandard) and [latest ECMAScript Specification](https://www.ecma-international.org/ecma-262).

## Distribution

You can distribute this software freely under [GNU GPL v3.0](https://github.com/berkerol/guess-the-number/blob/master/LICENSE).
