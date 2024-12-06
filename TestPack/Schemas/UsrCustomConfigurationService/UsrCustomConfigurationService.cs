namespace Terrasoft.Configuration.UsrCustomConfigurationServiceNamespace
{
    using System;
    using System.ServiceModel;
    using System.ServiceModel.Web;
    using System.ServiceModel.Activation;
    using Terrasoft.Core;
    using Terrasoft.Web.Common;
    using Terrasoft.Core.Entities;
    using System.Runtime.Serialization;
    using System.Collections.Generic;
    using Terrasoft.Core.Entities.Extensions;
    using Terrasoft.Common;
    using Terrasoft.Configuration.Utils;
    using Nest;

    [DataContract]
    public class ContactSearchParameters
    {
        [DataMember(Name = "Name")]
        public string Name { get; set; }

        [DataMember(Name = "Age")]
        public int Age { get; set; }

        [DataMember(Name = "NsTestBool")]
        public bool NsTestBool { get; set; }
    }

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class UsrCustomConfigurationService : BaseService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json)]
        public string GetContactIdByValue(ContactSearchParameters parameters)
        {
            var result = "";
            var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Contact");
            var colId = esq.AddColumn("Id");
            //var filters = new List<EntitySchemaQueryFilter>();
            var orGroup = new EntitySchemaQueryFilterCollection(esq, LogicalOperationStrict.Or); 

            if (!string.IsNullOrEmpty(parameters.Name))
            {
                esq.AddColumn("Name");
                //var nameFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "Name", parameters.Name);
                //esq.Filters.Add(nameFilter);
                orGroup.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, nameof(Name), parameters.Name));
            }

            if (parameters.Age > 0)
            {
                esq.AddColumn("Age");
                //var ageFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "Age", parameters.Age);
                //esq.Filters.Add(ageFilter);
                orGroup.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "Age", parameters.Age));
            }

            esq.AddColumn("NsTestBool");
            //var nsTestBoolFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "NsTestBool", parameters.NsTestBool);
            //esq.Filters.Add(nsTestBoolFilter);
            orGroup.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "NsTestBool", parameters.NsTestBool));
            esq.Filters.Add(orGroup);

            var entities = esq.GetEntityCollection(UserConnection);
            if (entities.Count > 0)
            {
                result = entities[0].GetColumnValue(colId.Name).ToString();
            }

            return result;
        }
    }
}
