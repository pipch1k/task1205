 define("ActivitySectionV2", ["BaseFiltersGenerateModule", "ProcessModuleUtilities"], function (BaseFiltersGenerateModule, ProcessModuleUtilities) {
  return {
    entitySchemaName: "Activity",
	attributes: {
 		"isActivityButtonVisible": {
			"dataValueType": Terrasoft.DataValueType.BOOLEAN,
        	"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
  			"value": false
 		}
	},
	messages: {
 		"GetOwnerButtonStatus": {
  			mode: Terrasoft.MessageMode.PTP,
  			direction: Terrasoft.MessageDirectionType.SUBSCRIBE
 		},
		"MessageStartMethod":{
			mode: Terrasoft.MessageMode.PTP,
  			direction: Terrasoft.MessageDirectionType.PUBLISH
		}
	},
    methods: {
		init: function() {
  			this.callParent(arguments);
  			this.sandbox.subscribe("GetOwnerButtonStatus", function(value) { this.getOrderButtonStatus(value); }, this,[this.getCardModuleSandboxId()]);
		},
		/*getSectionActions: function () {
        	var actionMenuItems = this.callParent(arguments);
        	actionMenuItems.addItem(
          		this.getButtonMenuItem({
            		Caption: {bindTo: "Resources.Strings.CreationOwnerActionCaption",},
            		Click: { bindTo: "sendMessage" },
            		Enabled: true//{ bindTo: "isActivityButtonVisible" },
          			})
        		);
			return actionMenuItems;
      	},*/
		sendMessage: function() {
			this.sandbox.publish("MessageStartMethod", this.get("ActiveRow"), [this.sandbox.id]);			
		},
		getOrderButtonStatus: function(owner) {
  			if (owner) {
   				this.set("isActivityButtonVisible", true);
  			}
  			else {
  				this.set("isActivityButtonVisible", false);
  			}
 		},
		onOpenOwnerClick: function() {
                var activeRow = this.get("ActiveRow");
                if (activeRow) {
                    var OwnerId = this.get("GridData").get(activeRow).get("Owner").value;
                    if (OwnerId) {
                        var requestUrl = "CardModuleV2/ContactPageV2/edit/" + OwnerId;
                        this.sandbox.publish("PushHistoryState", {hash: requestUrl});
                    }
                }
		},
		setButtonEnabled: function(activeRow, context) {
			if (context.isOwnerExist(activeRow)) {
                    context.set("isActivityButtonVisible", true);
                }
                else {
                    context.set("isActivityButtonVisible", false);
                }
		},
		isOwnerExist: function(id) {
			var ownerExist = this.get("GridData").get(id).get("Owner");
                return (ownerExist || ownerExist !== "") ? true : false;
		},
		onCardRendered: function() {
			this.callParent();
            var gridData = this.get("GridData");
            var activeRow = this.get("ActiveRow");
            if (activeRow)
            	{
                    this.setButtonEnabled(activeRow, this);
                }
            else {
            	var historyState = this.sandbox.publish("GetHistoryState");
                var hash = historyState.hash;
                if (hash && hash.valuePairs)
                    {
                        activeRow = hash.valuePairs[0].name;
                        this.set("ActiveRow", activeRow);
                        var self = this;
                        gridData.on("dataloaded", function() {
                            self.setButtonEnabled(activeRow, self);
                        });
                    }
                }
                gridData.on("itemchanged", function() {
                    this.setButtonEnabled(activeRow, this);
                }, this);
		}
    },
    diff: /**SCHEMA_DIFF*/ [
            {
                "operation": "insert",
                "parentName": "CombinedModeActionButtonsCardLeftContainer",
                "propertyName": "items",
                "name": "MainContactButton",
                "values": {
                    "itemType": Terrasoft.ViewItemType.BUTTON,
                    "caption": {bindTo: "Resources.Strings.CreationOwnerActionCaption"},
                    "click": {bindTo: "onOpenOwnerClick"},
                    "style": Terrasoft.controls.ButtonEnums.style.BLUE,
                    "enabled": {bindTo: "isActivityButtonVisible"}
                }
            }
	] /**SCHEMA_DIFF*/,
  };
});
