TEMPLATE = app
           CONFIG += c++11
           QT += widgets

           SOURCES += main.cpp

           # Add MongoDB C++ Driver paths here
           INCLUDEPATH += /path/to/mongocxx/include
           LIBS += -L/path/to/mongocxx/lib -lmongocxx -lbsoncxx
