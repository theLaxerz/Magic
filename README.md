# Magic

A Qt-based desktop application for browsing and interacting with LinkedIn Messages posts stored in MongoDB.

## Overview

Magic is a C++/Qt application called "Aggregator" that provides a graphical interface for viewing LinkedIn posts retrieved from a MongoDB database. The application features a grid-based layout with pagination and interactive capabilities for engaging with posts.

## Features

- **MongoDB Integration**: Connects to local MongoDB database to fetch LinkedIn Messages posts
- **Grid View Display**: Shows posts in a 20x20 grid layout
- **Pagination**: Navigate through multiple pages of posts
- **Interactive Browser**: Modal browser for liking and commenting on posts
- **Real-time Refresh**: Update view with latest data from database

## Technology Stack

- C++11
- Qt Framework (Widgets)
- MongoDB C++ Driver (mongocxx, bsoncxx)

## Quick Start

For detailed information about setup, configuration, and usage, see [ABOUT.md](ABOUT.md).

### Basic Setup

1. Install Qt Framework and MongoDB C++ Driver
2. Configure MongoDB paths in `Aggregator/Aggregator.pro`
3. Build with `qmake` and `make`
4. Run `./Aggregator`

## Documentation

- [ABOUT.md](ABOUT.md) - Comprehensive repository information
- [Aggregator/CLAUDE.md](Aggregator/CLAUDE.md) - Development guidance

## License

GNU General Public License v3.0 - See [LICENSE](LICENSE) for details
