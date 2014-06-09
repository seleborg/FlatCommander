// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            args.setPromise(WinJS.UI.processAll().done(function (someValue) {
                var storageFolder = Windows.Storage.KnownFolders.picturesLibrary;
                var folderPanelContainer = document.getElementById("folderPanelContainer");
                setFolder(folderPanelContainer, storageFolder);
            }));
        }
    };

    function setFolder(folderPanelContainer, storageFolder) {
        var itemQuery = storageFolder.createItemQuery();

        var dataSourceOptions = {
            mode: Windows.Storage.FileProperties.ThumbnailMode.listView,
            requestedThumbnailSize: 32,
            thumbnailOptions: Windows.Storage.FileProperties.ThumbnailOptions.none
        };

        var dataSource = new WinJS.UI.StorageDataSource(itemQuery, dataSourceOptions);

        var folderNameDiv = folderPanelContainer.querySelector("#folderName");
        folderNameDiv.textContent = storageFolder.displayName;

        var listViewElement = folderPanelContainer.querySelector("#folderItems");

        var listViewOptions = {
            itemDataSource: dataSource,
            itemTemplate: storageRenderer,
            layout: new WinJS.UI.ListLayout(),
            selectionMode: "single"
        };

        var listViewControl = new WinJS.UI.ListView(listViewElement, listViewOptions);
    }

    function storageRenderer(itemPromise, element) {
        if (!element) {
            // dom is not recycled, so create inital structure
            element = document.createElement("div");
        }

        var itemNameElement = document.createElement("span");
        var itemThumbnailElement = document.createElement("img");

        element.appendChild(itemThumbnailElement);
        element.appendChild(itemNameElement);

        return {
            // returns the placeholder
            element: element,
            // and a promise that will complete when the item is fully rendered
            renderComplete: itemPromise.then(function (item) {
                itemNameElement.textContent = item.data.displayName;
                return item.ready;
            }).then(function (item) {
                // wait until item.ready before doing expensive work
                return WinJS.UI.StorageDataSource.loadThumbnail(item, itemThumbnailElement).then(function (image) {
                    // perform any operation that requires the thumbnail to be available
                });
            })
        };
    }

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
