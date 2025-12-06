# About Magic Repository

## Repository Overview

**Name:** Magic  
**Owner:** theLaxerz  
**License:** GNU General Public License v3.0 (GPL-3.0)  
**Repository URL:** https://github.com/theLaxerz/Magic

## Project Description

Magic is a Qt-based desktop application called "Aggregator" that provides a graphical user interface for browsing and interacting with LinkedIn Messages posts stored in a MongoDB database.

## Key Features

- **Grid-Based Post Display:** Shows LinkedIn posts in a 20x20 grid layout
- **MongoDB Integration:** Connects to a local MongoDB database to fetch and display posts
- **Pagination:** Navigate through multiple pages of posts
- **Interactive Modal Browser:** Click on posts to open a modal browser for liking and commenting
- **Real-Time Refresh:** Refresh button to fetch the latest data from MongoDB

## Technology Stack

### Core Technologies
- **C++11:** Modern C++ programming language
- **Qt Framework:** Cross-platform application framework
  - Qt Widgets module for GUI components
- **MongoDB C++ Driver:** Database connectivity
  - mongocxx: MongoDB C++ driver
  - bsoncxx: BSON (Binary JSON) library

### Build System
- **qmake:** Qt's build tool for generating Makefiles

## Project Structure

```
Magic/
├── Aggregator/                # Main application directory
│   ├── Aggregator.pro        # Qt project configuration
│   ├── CLAUDE.md            # Development guidance for AI assistants
│   └── main.cpp             # Application entry point
├── Aggregator.pro            # Root project configuration
├── .gitignore               # Git ignore rules (with merge conflict markers)
├── LICENSE                  # GNU GPL v3.0 license
└── README.md               # Basic project information
```

## Application Components

### Main Window
- **QMainWindow:** Primary application window
- **QListView:** Displays posts in list format (currently configured)
- **QPushButton:** "Refresh" button for updating data

### Database Connection
- **Connection String:** `mongodb://localhost:27017/`
- **Database:** `your_database`
- **Collection:** `posts`
- Contains LinkedIn Messages data

### Data Flow
1. Application initializes Qt application and MongoDB connection
2. User interface is set up with list view and refresh button
3. User clicks "Refresh" to fetch posts
4. Application queries MongoDB collection
5. Posts are retrieved as BSON documents
6. Documents are converted to JSON and displayed in the list view

## Development Setup

### Prerequisites
1. **Qt Framework** with Widgets module installed
2. **MongoDB C++ Driver** (mongocxx and bsoncxx)
3. **Local MongoDB server** running on port 27017
4. **C++11 compatible compiler**

### Configuration Steps

1. **Update MongoDB Driver Paths** in `Aggregator/Aggregator.pro`:
   ```
   INCLUDEPATH += /path/to/mongocxx/include
   LIBS += -L/path/to/mongocxx/lib -lmongocxx -lbsoncxx
   ```

2. **Configure Database Connection** in `Aggregator/main.cpp`:
   - Update MongoDB URI if not using default localhost
   - Modify database name from `your_database` to actual database
   - Update collection name if different from `posts`

### Build Instructions

```bash
# Navigate to the Aggregator directory
cd Aggregator

# Generate Makefile using qmake
qmake Aggregator.pro

# Compile the application
make

# Run the application
./Aggregator
```

## Current Implementation Status

### Working Features
- Basic Qt application structure with QApplication
- MongoDB connection initialization
- Simple list view for displaying posts
- Refresh button to fetch data from MongoDB
- JSON conversion and display of posts

### Planned/Future Features (per CLAUDE.md)
- 20x20 grid view layout (currently using QListView)
- Pagination controls for navigating between pages
- Modal browser for interactive post engagement
- Like functionality for posts
- Comment functionality for posts

## Database Schema

The application expects a MongoDB collection with LinkedIn Messages posts. The exact schema is flexible as documents are displayed as JSON strings, but typically would include:
- Post content
- Author information
- Timestamps
- Engagement metrics (likes, comments)
- Other LinkedIn post metadata

## Known Issues

1. **Merge Conflict in .gitignore:** The `.gitignore` file contains unresolved merge conflict markers between Python-specific ignores and environment file ignores.

2. **Placeholder Paths:** The MongoDB C++ driver paths in the `.pro` files are placeholders and need to be configured for each development environment.

3. **Generic Database Names:** The database is named "your_database" which should be changed to the actual database name.

4. **UI Mismatch:** The current implementation uses `QListView` while documentation describes a grid view layout.

## License Information

This project is licensed under the GNU General Public License v3.0 (GPL-3.0), which is a free, copyleft license for software. Key points:

- ✅ **Permissions:** Commercial use, modification, distribution, patent use, private use
- ⚠️ **Conditions:** License and copyright notice, state changes, disclose source, same license
- ❌ **Limitations:** Liability, warranty

Full license text available in the LICENSE file.

## Contributing

As this appears to be an early-stage project with basic functionality, contributions would likely focus on:
- Implementing the grid view layout
- Adding pagination controls
- Creating the modal browser interface
- Enhancing MongoDB query capabilities
- Improving error handling and user feedback
- Adding configuration file support

## Contact & Support

Repository: https://github.com/theLaxerz/Magic
Owner: theLaxerz

---

*This documentation was generated through automated repository analysis on December 6, 2025.*
