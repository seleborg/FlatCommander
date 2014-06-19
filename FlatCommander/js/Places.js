(function () {
    "use strict";

    WinJS.Namespace.define("FlatCommander.Places", {
        initPlacesBar: initPlacesBar,
        onPlaceActivated: onPlaceActivated,
    });


    var onPlaceActivated = function (storageFolder) { };
    var _placesBar = null;


    function initPlacesBar(element) {
        element.classList.add('fc-placesbar');
        element.appendChild(createPlaceButton(Windows.Storage.KnownFolders.picturesLibrary));
        element.appendChild(createPlaceButton(Windows.Storage.KnownFolders.videosLibrary));
        element.appendChild(createPlaceButton(Windows.Storage.KnownFolders.musicLibrary));

        element.appendChild(createAddPlaceButton());

        _placesBar = element;
    }


    function createPlaceButton(storageFolder) {
        var elem = document.createElement("span");
        elem.textContent = storageFolder.displayName;
        elem.classList.add('fc-placebutton');
        elem.addEventListener("click", function (event) {
            FlatCommander.Places.onPlaceActivated(storageFolder);
        }, false);
        return elem;
    }


    function createAddPlaceButton() {
        var elem = document.createElement("span");
        elem.textContent = "+";
        elem.classList.add('fc-placebutton');
        elem.addEventListener("click", function (event) {
            pickNewFolderPlace();
        }, false);
        return elem;
    }


    function pickNewFolderPlace() {
        // Verify that we are currently not snapped, or that we can unsnap to open the picker
        var currentState = Windows.UI.ViewManagement.ApplicationView.value;
        if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
            !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
            // Fail silently if we can't unsnap
            return;
        }

        // Create the picker object and set options
        var folderPicker = new Windows.Storage.Pickers.FolderPicker;
        folderPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.desktop;
        folderPicker.fileTypeFilter.replaceAll(["*"]);

        folderPicker.pickSingleFolderAsync().then(function (folder) {
            if (folder) {
                // Application now has read/write access to all contents in the picked folder (including sub-folder contents)
                // Cache folder so the contents can be accessed at a later time
                Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.addOrReplace("PickedFolderToken", folder);

                _placesBar.appendChild(createPlaceButton(folder));
            }
        });
    }
})();