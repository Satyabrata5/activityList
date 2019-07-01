({
    handleUserDetails: function (component, event, helper) {
        var userId = event.getParam('userId');
        var formattedUserId = userId.substring(0, userId.indexOf('-'));
        var url = '/lightning/r/User/' + formattedUserId + '/view';
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function (response) {
            var focusedTabId = response.tabId;
            workspaceAPI.openSubtab({
                parentTabId: focusedTabId,
                url: url,
                focus: true
            });
        })
            .catch(function (error) {
                console.log(error);
            });

    },
    handleRecordDetails: function (component, event, helper) {
        var object = event.getParam('triggeredObject');
        var id = event.getParam('triggeredObjectId');
        var url = '/lightning/r/' + object + '/' + id + '/view';
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function (response) {
            var focusedTabId = response.tabId;
            workspaceAPI.openSubtab({
                parentTabId: focusedTabId,
                url: url,
                focus: true
            });
        })
            .catch(function (error) {
                console.log(error);
            });
    }
})
