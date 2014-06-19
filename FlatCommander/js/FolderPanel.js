(function () {
    "use strict";


    WinJS.Namespace.define("FlatCommander.FolderPanel", {
        initDualPanelView: initDualPanelView,
        activePanel: activePanel,
        inactivePanel: inactivePanel,
        leftPanel: leftPanel,
        rightPanel: rightPanel,
    });


    var activePanel = null;
    var inactivePanel = null;
    var leftPanel = null;
    var rightPanel = null;


    function initDualPanelView(leftPanelContainer, leftStorageFolder,
                               rightPanelContainer, rightStorageFolder) {
        FlatCommander.FolderPanel.leftPanel = initFolderPanelContainer(leftPanelContainer);
        FlatCommander.FolderPanel.rightPanel = initFolderPanelContainer(rightPanelContainer);

        FlatCommander.FolderPanel.leftPanel.goToFolder(leftStorageFolder);
        FlatCommander.FolderPanel.rightPanel.goToFolder(rightStorageFolder);

        FlatCommander.FolderPanel.activePanel = FlatCommander.FolderPanel.leftPanel;
        FlatCommander.FolderPanel.inactivePanel = FlatCommander.FolderPanel.rightPanel;
    }


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

        folderPanelContainer.addEventListener("focusin", function (event) {
            FlatCommander.FolderPanel.inactivePanel = FlatCommander.FolderPanel.activePanel;
            FlatCommander.FolderPanel.activePanel = this;
        }, false);

        var listViewElement = folderPanelContainer.querySelector("#folderItems");

        var listViewOptions = {
            itemTemplate: folderItemTemplate,
            layout: new WinJS.UI.ListLayout(),
            selectionMode: "single"
        };

        var listViewControl = new WinJS.UI.ListView(listViewElement, listViewOptions);
        folderPanelContainer._listViewControl = listViewControl;
        
        listViewControl.addEventListener("iteminvoked", function (event) {
            onListViewItemInvoked(folderPanelContainer, event);
        }, false);
        folderPanelContainer.addEventListener("keypress", onKeyPressed, false);

        return folderPanelContainer;
    };


    function onListViewItemInvoked(folderPanelContainer, event) {
        event.detail.itemPromise.done(function (item) {
            return function (storageFolder) {
                if (item.data.attributes & Windows.Storage.FileAttributes.directory) {
                    folderPanelContainer.goToFolder(storageFolder);
                }
            }(item.data);
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