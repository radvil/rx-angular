# RxAngular ![rx-angular CI](https://github.com/rx-angular/rx-angular/workflows/rx-angular%20CI/badge.svg?branch=main)

RxAngular offers a comprehensive toolset for handling fully reactive Angular applications with the main focus on runtime
performance and template rendering.

RxAngular is divided into different packages:

- [📦@rx-angular/cdk](https://github.com/rx-angular/rx-angular/tree/main/libs/cdk/README.md)
- [📦@rx-angular/state](https://github.com/rx-angular/rx-angular/tree/main/libs/state/README.md)
- [📦@rx-angular/template](https://github.com/rx-angular/rx-angular/tree/main/libs/template/README.md)

Used together, you get a powerful tool for developing high-performance angular applications with or without NgZone.

This repository holds a set of helpers to create **fully reactive** as well as **fully zone-less** applications.

[![rx-angular logo](https://raw.githubusercontent.com/rx-angular/rx-angular/main/docs/images/rx-angular_logo.png)](https://www.rx-angular.io/)
## Links

- [📚 Official docs](https://www.rx-angular.io/)
- [![Discord](https://icongr.am/material/discord.svg?size=16&color=7289da) Discord channel](https://discord.com/invite/XWWGZsQ)

## Packages

Find details in the linked readme files below for installation and setup instructions, examples and resources.

- [📦@rx-angular/cdk](https://github.com/rx-angular/rx-angular/tree/main/libs/cdk/README.md) - Component Development Kit
- [📦@rx-angular/state](https://github.com/rx-angular/rx-angular/tree/main/libs/state/README.md) - Imperative&Reactive Component State-Management
- [📦@rx-angular/template](https://github.com/rx-angular/rx-angular/tree/main/libs/template/README.md) - High-Performance Reactive Rendering

## Version Compatibility


| Angular                | RxJS                 | @rx-angular/state | @rx-angular/template | @rx-angular/cdk     | 
|------------------------|----------------------|-------------------|----------------------|---------------------|
| `^12.0.0` or `^13.0.0` | `^6.5.5` or `^7.4.0` | `> 1.4.6`         | `> 1.0.0-beta.29`    | `> 1.0.0-alpha.10`  |
| `^11.0.0`              | `^6.5.5`             | `<= 1.4.6`        | `<= 1.0.0-beta.29`   | `<= 1.0.0-alpha.10` |


Regarding the compatibility to RxJs, we generally stick to the compatibilities of the angular framework itself.
All the packages support RxJs versions `^6.5.5` || `^7.4.0`.
For more information about the compatibilities of angular itself see this [gist](https://gist.github.com/LayZeeDK/c822cc812f75bb07b7c55d07ba2719b3)
