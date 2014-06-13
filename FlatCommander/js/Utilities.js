(function () {
    "use strict";

    function bindThumbnail(source, sourceProperty, destination, destinationProperty) {
        var image = destination;
        var item = source;

        var thumbnailUpdateHandler,
                shouldRespondToThumbnailUpdate = false;

        // Load a thumbnail if it exists.
        var processThumbnail = function (thumbnail) {
            if (thumbnail) {
                var url = URL.createObjectURL(thumbnail, { oneTimeOnly: true });
                image.src = url;

                // If we have the full resolution thumbnail, we can cancel further updates and complete the promise
                // when current work is complete.
                if ((thumbnail.type !== Windows.Storage.FileProperties.ThumbnailType.icon) && !thumbnail.returnedSmallerCachedSize) {
                    item.removeEventListener("thumbnailupdated", thumbnailUpdateHandler);
                    shouldRespondToThumbnailUpdate = false;
                }
            }
        };

        thumbnailUpdateHandler = function (e) {
            // Ensure that a zombie update handler does not get invoked.
            if (shouldRespondToThumbnailUpdate) {
                processThumbnail(e.target.thumbnail);
            }
        };
        item.addEventListener("thumbnailupdated", thumbnailUpdateHandler);
        shouldRespondToThumbnailUpdate = true;

        // If we already have a thumbnail we should render it now.
        processThumbnail(item.thumbnail);
    }

    WinJS.Utilities.markSupportedForProcessing(bindThumbnail);


    function bindStorageItemProperty(storageItem, property, element, attribute) {
        var updateHandler = function (event) {
            for (var i = 0; i < property.length; i++) {
                var propVal = storageItem[property[i]];
                if (propVal) {
                    element[attribute[i]] = storageItem[property[i]];
                }
            }
        };
        storageItem.addEventListener("propertiesupdated", updateHandler, false);
        updateHandler(null);
    }

    WinJS.Utilities.markSupportedForProcessing(bindStorageItemProperty);


    WinJS.Namespace.define("FlatCommander.Utilities", {
        bindThumbnail: bindThumbnail,
        bindStorageItemProperty: bindStorageItemProperty
    });
})();