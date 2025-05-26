#include <QApplication>
#include <QMainWindow>
#include <QVBoxLayout>
#include <QPushButton>
#include <QListView>
#include <QStringListModel>
#include <QtDebug>
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>
#include <bsoncxx/json.hpp>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    mongocxx::instance instance{};
    mongocxx::client client{mongocxx::uri{"mongodb://localhost:27017/"}};
    auto collection = client["your_database"]["posts"];

    QMainWindow window;
    QWidget centralWidget;
    QVBoxLayout layout;
    QListView listView;
    QPushButton refreshButton{"Refresh"};

    QStringListModel model;
    listView.setModel(&model);

    layout.addWidget(&listView);
    layout.addWidget(&refreshButton);
    centralWidget.setLayout(&layout);
    window.setCentralWidget(&centralWidget);

    QObject::connect(&refreshButton, &QPushButton::clicked, [&]() {
        QStringList postsList;
        auto cursor = collection.find({});
        for (auto&& doc : cursor) {
            auto jsonDoc = bsoncxx::to_json(doc);
            postsList << QString::fromStdString(jsonDoc);
        }
        model.setStringList(postsList);
    });

    window.setWindowTitle("Aggregator");
    window.show();
    return app.exec();
}
