(function () {
    "use strict";


    WinJS.Namespace.define("FlatCommander.FolderPanel", {
        initFolderPanelContainer: initFolderPanelContainer
    });


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
        }
    };


    function goToFolder(storageFolder) {
        this._saveCurrentItem();

        var folderNameDiv = this.querySelector("#folderName");
        folderNameDiv.textContent = storageFolder.displayName;

        var itemQuery = storageFolder.createItemQuery();

        var dataSourceOptions = {
            mode: Windows.Storage.FileProperties.ThumbnailMode.listView,
            requestedThumbnailSize: 32,
            thumbnailOptions: Windows.Storage.FileProperties.ThumbnailOptions.none
        };

        var dataSource = new WinJS.UI.StorageDataSource(itemQuery, dataSourceOptions);
        this._listViewControl.itemDataSource = dataSource;
        this.folder = storageFolder;
        this._restoreCurrentItem();
    };


    function _saveCurrentItem() {
        this._currentItemCache[_getUniqueIdentifier(this.folder)] = this._listViewControl.currentItem;
    }


    function _restoreCurrentItem() {
        var currentItem = this._currentItemCache[_getUniqueIdentifier(this.folder)];

        if (!currentItem) {
            currentItem = {
                index: 0,
                showFocus: true
            };
        }

        this._listViewControl.currentItem = currentItem;
    }


    function _getUniqueIdentifier(item) {
        if (!item) {
            return null;
        }

        var id = null;
        if (item["path"]) {
            id = "Path: " + item.path;
        }
        else if (item["displayType"] === "Library") {
            id = item.displayType + ": " + item.displayName;
        }

        if (!id) {
            debugger;
        }

        return id;
    }


    function initFolderPanelContainer(folderPanelContainer) {
        folderPanelContainer.goToFolder = goToFolder;
        folderPanelContainer.goToParentFolder = goToParentFolder;
        folderPanelContainer._saveCurrentItem = _saveCurrentItem;
        folderPanelContainer._restoreCurrentItem = _restoreCurrentItem;
        folderPanelContainer._currentItemCache = {};

        var listViewElement = folderPanelContainer.querySelector("#folderItems");

        var listViewOptions = {
            itemTemplate: storageRenderer,
            layout: new WinJS.UI.ListLayout(),
            selectionMode: "single"
        };

        var listViewControl = new WinJS.UI.ListView(listViewElement, listViewOptions);
        folderPanelContainer._listViewControl = listViewControl;
        
        listViewControl.addEventListener("iteminvoked", onListViewItemInvoked, false);
        folderPanelContainer.addEventListener("keypress", onKeyPressed, false);
    };


    function onListViewItemInvoked(event) {
        event.detail.itemPromise.done(function (item) {
            return function (folderPanelContainer, storageFolder) {
                if (item.data.attributes & Windows.Storage.FileAttributes.directory) {
                    folderPanelContainer.goToFolder(storageFolder);
                }
            }(folderPanelContainer, item.data);
        });
    }


    function onKeyPressed(event) {
        if (event.key && event.key === "Backspace") {
            this.goToParentFolder();
        }
    }


    function goToParentFolder() {
        var that = this;
        this.folder.getParentAsync().then(function (parentFolder) {
            if (parentFolder) {
                that.goToFolder(parentFolder);
            }
        });
    }
})();