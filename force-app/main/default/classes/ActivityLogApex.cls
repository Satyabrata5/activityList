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
}
