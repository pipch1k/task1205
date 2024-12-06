 namespace Terrasoft.Configuration.UsrCustomConfigServiceNamespace 
{ 
    using System; 
    using System.ServiceModel; 
    using System.ServiceModel.Web; 
    using System.ServiceModel.Activation; 
    using Terrasoft.Core; 
    using Terrasoft.Web.Common; 
    using Terrasoft.Core.Entities; 

    [ServiceContract] 
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)] 
    public class UsrCustomConfigService : BaseService 
    {
        [OperationContract] 
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)] 
        public string GetContactIdByName(string Name) 
        {
            var result = "";
            var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Contact");
            var colId = esq.AddColumn("Id"); 
            var colName = esq.AddColumn("Name");
            var esqFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "Name", Name); 
            esq.Filters.Add(esqFilter);
            var entities = esq.GetEntityCollection(UserConnection);
            
            if (entities.Count > 0) 
            {
                result = entities[0].GetColumnValue(colId.Name).ToString();
            } 

            return result; 
        } 
    } 
}