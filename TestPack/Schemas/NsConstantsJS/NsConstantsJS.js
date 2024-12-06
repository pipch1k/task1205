  define("NsConstantsJS", ["NsConstantsJSResources"],
	function (NsConstantsJSResources) {
	 
	 const AccountType = {
		 Customer:"03a75490-53e6-df11-971b-001d60e938c6",
		 Partner:"f2c0ce97-53e6-df11-971b-001d60e938c6",
		 Contractor:"f3c0ce97-53e6-df11-971b-001d60e938c6",
		 Supplier:"d34b9da2-53e6-df11-971b-001d60e938c6",
		 Competitor:"d44b9da2-53e6-df11-971b-001d60e938c6",
		 OurCompany:"57412fad-53e6-df11-971b-001d60e938c6"
	 };
	return {
		AccountType: AccountType,
	};
});
