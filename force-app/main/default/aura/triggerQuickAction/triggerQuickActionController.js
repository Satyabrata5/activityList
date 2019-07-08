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
    },
    associateUsages: function (component, event, helper) {
        var url = '/apex/generatePDF?id=' + component.get("v.recordId");
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();

    },
    savePDF: function (cmp, event, helper) {
        var action = cmp.get("c.savePDFOpportunity");
        action.setParams({
            "caseId": cmp.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            cmp.set('v.contentId', response.getReturnValue());
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    type : 'success',
                    "message": "PDF generated successfully! Please check attachments"
                });
                toastEvent.fire();
                $A.get('e.lightning:openFiles').fire({
                    recordIds: [cmp.get("v.contentId")]
                });
                $A.get('e.force:refreshView').fire();
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }

})