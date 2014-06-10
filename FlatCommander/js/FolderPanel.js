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
    }
};
