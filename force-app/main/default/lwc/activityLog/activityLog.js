import { LightningElement, api, wire, track } from 'lwc';
import getActivityLogs from '@salesforce/apex/ActivityLogApex.getActivityLogs';
import { refreshApex } from '@salesforce/apex';

export default class ActivityLog extends LightningElement {
  @api recordId;
  @track openmodel = false;
  @track activitylogs ;
  @track mydata;
  @wire(getActivityLogs, { caseId: '$recordId' })
  activitylog(result) {
    this.mydata = result;
    if (result.data) {
      this.activitylogs = [];
      for (let key in result.data) {
        if (result.data.hasOwnProperty(key)) { // Filtering the data in the loop
          this.activitylogs.push({ value: result.data[key], key: result.data[key].Object_Id__c });
        }
      }
    }
    else if (result.error) {
      window.console.log(result.error);
    }
  }
  openmodal() {
    this.openmodel = true;
    return refreshApex(this.mydata);
  }
  closeModal() {
    this.openmodel = false
  }
  redirectToUser(event) {
    var userId;
    userId = event.target.id;
    const userClickedEvt = new CustomEvent('userClicked', {
      detail: { userId },
    });
    this.dispatchEvent(userClickedEvt);
  }
  navigateToRecord(event) {
    var triggeredObjectId = event.target.id.substring(0, event.target.id.indexOf('-'));
    var triggeredObject;
    this.activitylogs.forEach(function (result) {
      if (result.key === triggeredObjectId) {
        triggeredObject = result.value.Object_Name__c;
      }
    });
    const objectRecordClickedEvt = new CustomEvent('objectRecordClicked', {
      detail: { triggeredObject, triggeredObjectId },
    });
    this.dispatchEvent(objectRecordClickedEvt);
  }
}
