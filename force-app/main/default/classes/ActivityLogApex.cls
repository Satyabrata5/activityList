public with sharing class ActivityLogApex {
    @AuraEnabled(cacheable=true)
    public static List<ActivityTracking__c> getActivityLogs(String caseId) {
        return [SELECT Id, Name,Object_Name__c,Description__c,Object_Id__c,createdBy.Name,createdById,FORMAT(createdDate) from ActivityTracking__c where case__c = :caseId order by CreatedDate desc];
    }
    /* public static Map<String,ActivityTracking__c> getActivityLogs(String caseId) {
        Map<String,ActivityTracking__c> objectToaActivityMap=new Map<String,ActivityTracking__c>();
        for(ActivityTracking__c ac : [SELECT Id, Name,Object_Name__c,Object_Id__c,Description__c,createdBy.Name,createdById,createdDate from ActivityTracking__c where case__c = :caseId order by createdDate desc])
        {
           objectToaActivityMap.put(ac.Object_Id__c,ac);
        }
        return objectToaActivityMap;
    } */

    @auraEnabled
    public static Id savePDFOpportunity(String caseId){
        PageReference pdfPage = new PageReference('/apex/generatePDF');
		pdfPage.getParameters().put('Id', caseId);
        Blob pdfContent = pdfPage.getContent();
        
       	/* List<Attachment> attachmentToDelete= [SELECT Id from Attachment where ParentId=:caseId and Name='Test Attachment for PDF.pdf'];
        if(attachmentToDelete.size()>0){
          DELETE attachmentToDelete; 
        }  */
        /*Attachment attach1= new Attachment();
        attach1.ParentId = caseId;
        attach1.Name = 'Test Attachment for PDF.pdf';
        attach1.Body = pdfContent;
        attach1.contentType = 'application/pdf';
		insert attach1;*/
        //return attach1.Id;
		
        List<ContentDocument> cd = [SELECT Id,Title FROM ContentDocument where Title='Test Attachment for PDF'];
        if(cd.size()>0){
          DELETE cd; 
        } 
        ContentVersion cv = new ContentVersion();
        cv.ContentLocation = 'S';
        cv.VersionData = pdfContent;
        cv.Title = 'Test Attachment for PDF';
        cv.PathOnClient = 'Test_Attachment_for_PDF.pdf';
        insert cv;
        Id generatedDocId=[SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv.Id].ContentDocumentId;
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = generatedDocId;
        cdl.LinkedEntityId = caseId;
        cdl.ShareType = 'V';
        insert cdl;
        return generatedDocId;
        
        
    }
}