# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Qt-based desktop application called "Aggregator" that connects to a MongoDB database and displays LinkedIn Messages posts in a grid view. The application allows users to browse LinkedIn posts in a 20x20 grid layout with pagination, and interact with posts through a modal browser for liking and commenting.

## Technology Stack

- C++11
- Qt Framework (with Widgets module)
- MongoDB C++ Driver (mongocxx and bsoncxx)

## Build Instructions

To build the project:

```bash
# Configure the MongoDB C++ driver paths in Aggregator.pro first
# Then build with qmake and make
qmake Aggregator.pro
make
```

## MongoDB Setup

The application expects a local MongoDB server running on the default port:
```
mongodb://localhost:27017/
```

It connects to a database named "your_database" and collection "posts" which contains LinkedIn Messages data. You may need to create these or modify the connection string in main.cpp to match your MongoDB setup.

## Dependencies

The project requires:

1. Qt Framework (with Widgets module)
2. MongoDB C++ Driver

You need to set the correct paths to the MongoDB C++ Driver in the Aggregator.pro file:

```
INCLUDEPATH += /path/to/mongocxx/include
LIBS += -L/path/to/mongocxx/lib -lmongocxx -lbsoncxx
```

## UI Components

- Main Window: Displays a grid of LinkedIn posts
- Grid View: 20x20 layout showing as many posts as can fit on a page
- Pagination Controls: Allows navigation between pages of posts
- Modal Browser: Opens when a post is clicked, enabling users to like or comment on the post
- Refresh Button: Updates the view with the latest data from MongoDB

## Architecture Notes

The application is a Qt GUI application with:
- A main window containing a grid view of posts and pagination controls
- Connection to a MongoDB database (default: mongodb://localhost:27017/)
- Data fetching from a collection named "posts" in "your_database" specifically for LinkedIn Messages
- Grid-based display of LinkedIn posts with pagination
- Interactive features for liking and commenting on posts through a modal browser

When the refresh button is clicked, the application fetches LinkedIn Messages posts from the MongoDB collection and displays them in the grid view.

## Interaction Flow

1. Application initialization (QApplication)
2. MongoDB connection setup (mongocxx::client)
3. UI setup (QMainWindow, Grid Layout, Pagination Controls)
4. Data fetching of LinkedIn Messages from MongoDB
5. Display of LinkedIn posts in a 20x20 grid view
6. User clicks on a post to open the modal browser
7. Modal browser allows liking or commenting on the selected post
8. Pagination controls allow navigation between pages of posts