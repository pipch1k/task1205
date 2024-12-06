define("ActivityPageV2", ["BusinessRuleModule","NsConstantsJS"], function (BusinessRuleModule,NsConstantsJSResources) {
  return {
    entitySchemaName: "Activity",
	messages:{
	  "GetOwnerButtonStatus": {
  			mode: Terrasoft.MessageMode.PTP,
  			direction: Terrasoft.MessageDirectionType.PUBLISH
 		},
		"MessageStartMethod":{
			mode: Terrasoft.MessageMode.PTP,
  			direction: Terrasoft.MessageDirectionType.SUBSCRIBE
		}
	},
    attributes: {
		"isActivityButtonVisible": {
  			"value": false
 		},
		
    	"ActivityCategory": {
        	"dataValueType": Terrasoft.DataValueType.LOOKUP,
        	"dependencies": [
          		{
            		columns: ["ActivityCategory"],
            		methodName: "onActivityCategoryChange"
          		},
        	],
      },
      "ActivityCityOfOwnerStorage": {
        "dataValueType": Terrasoft.DataValueType.LOOKUP,
        "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
        "dependencies": [
          {
            columns: ["Owner"],
            methodName: "getActivityOwnerCountry",
          },
        ],
      },
      "Status": {
        "dataValueType": Terrasoft.DataValueType.LOOKUP,
        "lookupListConfig": {
          "filters": [
            function () {
              var filterGroup = Ext.create("Terrasoft.FilterGroup");
              filterGroup.add("StatusWorkFilter", Terrasoft.createColumnFilterWithParameter(
                Terrasoft.ComparisonType.EQUAL, "Visible", 1));
              return filterGroup;
            }
          ]
        }
      }
    },
	methods: {
    	init: function(callback, scope) {
        	this.callParent(arguments);
			this.sandbox.subscribe("MessageStartMethod", function(ownerId) { this.openPage(ownerId); }, this, ["SectionModuleV2_ActivitySectionV2"]);//[this.sandbox.id.slice(0, this.sandbox.id.lastIndexOf("_CardModuleV2"))]);
        	var owner = this.get("Owner");
        	if (owner) {
          		var ownerName = owner.displayValue;
          		//Terrasoft.showInformation("OnInit: Owner Name: " + ownerName);
        	} else {
          		//Terrasoft.showInformation("OnInit: No Owner selected.");
        	}
      	},

      	onEntityInitialized: function () {
			this.callParent(arguments);
			this.getOwnerButtonStatus();////////////////////////////////////////////////////////////////////////////////////////
        	var owner = this.get("Owner");
        	if (owner) {
          		var ownerName = owner.displayValue;
          		//Terrasoft.showInformation("onEntityInitialized: Owner Name: " + ownerName);
        	} else {
          		//Terrasoft.showInformation("onEntityInitialized: No Owner selected.");
        	}
        	this.setDefaultValues();
      	},
		
		onActivityCategoryChange: function () {
			this.updateDetails();
		},
		
		setDefaultValues: function () {
        	var newDate = new Date(this.get("CreatedOn"));
        	newDate.setDate(newDate.getDate() + 5);
        	this.set("DueDate", newDate);
        	this.set("ShowInScheduler", false);
		},

		dueDateValidator: function () {
        	var invalidMessage = "";
        	if (this.get("DueDate") < this.get("CreatedOn")) {
          		invalidMessage = this.get("Resources.Strings.CreatedOnLessDueDateMessage");
        	}
        	return {
          		invalidMessage: invalidMessage
        	};
		},

		setValidationConfig: function () {
        	this.callParent(arguments);
        	this.addColumnValidator("DueDate", this.dueDateValidator);
        	this.addColumnValidator("CreatedOn", this.dueDateValidator);
		},

		getActivityOwnerCountry: function () {
        	var ownerId = this.get("Owner")?.Id;
        	if (!ownerId) {
          		this.set("ActivityCityOfOwnerStorage", null);
          		return;
        	}
        	var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
          		rootSchemaName: "Contact",
        		});
        	esq.addColumn("Country");
        	esq.filters.add("ownerFilter",
          		Terrasoft.createColumnFilterWithParameter(
            	Terrasoft.ComparisonType.EQUAL, "Id", ownerId)
        	);
        
        	esq.getEntity(ownerId, function (result) {
          		if (result.success) {
            		var country = result.entity.get("Country");
            		this.set("ActivityCityOfOwnerStorage", country);
          		}
        	}, this);
      	},
		
		getActions: function() {
        	var actionMenuItems = this.callParent(arguments);
            actionMenuItems.addItem(this.getButtonMenuItem({
            	Type: "Terrasoft.MenuSeparator",
                Caption: ""
            }));
            actionMenuItems.addItem(this.getButtonMenuItem({
            	"Caption": {bindTo: "Resources.Strings.CreationOwnerActionCaption"},
                "Tag": "onOpenOwnerClick",
                "Visible": "$isActivityButtonVisible"
            }));
            return actionMenuItems;
        },
		isAccountPrimaryContactSet: function () {
        	if (this.get("Owner")) 
                return;
      	},
		onOpenOwnerClick: function () {
			var ownerId = this.get("Owner").value;
        	if (!ownerId) {
         		return false;
        	}
			this.openPage(ownerId);
      	},
		openPage: function(ownerId) {
			var requestUrl = "CardModuleV2/ContactPageV2/edit/" + ownerId;
        	this.sandbox.publish("PushHistoryState", {hash: requestUrl});
		},
		getOwnerButtonStatus: function() {
  			this.sandbox.publish("GetOwnerButtonStatus", this.get("Owner"), [this.sandbox.id]);
  			var owner = this.get("Owner");
  			if (owner) {
   				this.set("isActivityButtonVisible", true);
  			}
  			else {
   				this.set("isActivityButtonVisible", false);
  			}
 		},
		onSaved: function() {
			this.callParent(arguments);
  			this.getOwnerButtonStatus();
 		},
    },
    details: /**SCHEMA_DETAILS*/ {} /**SCHEMA_DETAILS*/,
    diff: /**SCHEMA_DIFF*/ [] /**SCHEMA_DIFF*/,
  };
});
