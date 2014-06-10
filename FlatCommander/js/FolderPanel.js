var FolderPanel = {
    storageRenderer: function (itemPromise, element) {
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
        }
    },


    setFolder: function (storageFolder) {
        var folderNameDiv = this.querySelector("#folderName");
        folderNameDiv.textContent = storageFolder.displayName;

        var itemQuery = storageFolder.createItemQuery();

        var dataSourceOptions = {
            mode: Windows.Storage.FileProperties.ThumbnailMode.listView,
            requestedThumbnailSize: 32,
            thumbnailOptions: Windows.Storage.FileProperties.ThumbnailOptions.none
        };

        var dataSource = new WinJS.UI.StorageDataSource(itemQuery, dataSourceOptions);
        var listViewControl = folderPanelContainer.querySelector("#folderItems").winControl;
        listViewControl.itemDataSource = dataSource;

        this.folder = storageFolder;
    },


    initFolderPanelContainer: function (folderPanelContainer) {
        folderPanelContainer.setFolder = FolderPanel.setFolder;

        var listViewElement = folderPanelContainer.querySelector("#folderItems");

        var listViewOptions = {
            itemTemplate: FolderPanel.storageRenderer,
            layout: new WinJS.UI.ListLayout(),
            selectionMode: "single"
        };

        var listViewControl = new WinJS.UI.ListView(listViewElement, listViewOptions);

        function onItemInvoked(event) {
            event.detail.itemPromise.done(function (item) {
                return function (folderPanelContainer, storageFolder) {
                    if (item.data.attributes & Windows.Storage.FileAttributes.directory) {
                        folderPanelContainer.setFolder(storageFolder);
                    }
                }(folderPanelContainer, item.data);
            });
        }

        listViewControl.addEventListener("iteminvoked", onItemInvoked, false);
    }
};
