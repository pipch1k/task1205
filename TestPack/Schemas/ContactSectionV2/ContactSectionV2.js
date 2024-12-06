define("ContactSectionV2", [], function() {
	return {
		entitySchemaName: "Contact",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		methods: {
			getSectionActions: function () {
        		var actionMenuItems = this.callParent(arguments);
				actionMenuItems.each(function(item) {
            		if(item.values.Caption.bindTo === "Resources.Strings.ActualizeContactAgeCaption"){
                 		actionMenuItems.remove(item);
            		}
        		});
        		return actionMenuItems;
			}
		}
	};
});
