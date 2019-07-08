public class TextVFPDFController {
    public List<ActivityTracking__c> ac{get;set;}
    public TextVFPDFController(){
        Id oppId = apexpages.currentpage().getparameters().get('Id');
		ac = [SELECT Id, Name,Object_Name__c,Description__c,Object_Id__c,createdBy.Name,createdById,FORMAT(createdDate) from ActivityTracking__c where case__c = :oppId order by CreatedDate desc];
    }
}