 define("AccountAddressDetailV2", [], function() {
	return {
		entitySchemaName: "AccountAddress",
		messages: {
       		"MessageAboutChangeDetailSubscribe": {
         	mode: Terrasoft.MessageMode.PTP,
         	direction: Terrasoft.MessageDirectionType.PUBLISH
       	},
   	 },
		diff: /**SCHEMA_DIFF*/ [] /**SCHEMA_DIFF*/,
		methods: {
			addRecord: function() {
				this.callParent(arguments);
				var masterCardState = this.sandbox.publish("MessageAboutChangeDetailSubscribe", null, [this.sandbox.id.slice(0, this.sandbox.id.lastIndexOf("_detail_AccountAddress"))]);
				}
		}
	};
});
