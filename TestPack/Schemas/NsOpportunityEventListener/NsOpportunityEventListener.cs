namespace Terrasoft.Configuration
{
    using System;
    using Terrasoft.Core;
	using Terrasoft.Core.DB;
    using Terrasoft.Core.Entities;
	using System.Collections.Generic;
    using Terrasoft.Core.Entities.Events;

    [EntityEventListener(SchemaName = "Opportunity")]
    public class NsOpportunityEventListener : BaseEntityEventListener
    {
        public override void OnSaving(object sender, EntityBeforeEventArgs e)
        {
            ValidateBudgetAndAmount((Entity)sender);
			base.OnSaving(sender, e);
        }

        private void ValidateBudgetAndAmount(Entity entity)
        {
            decimal budget = entity.GetTypedColumnValue<decimal>("Budget");
            decimal amount = entity.GetTypedColumnValue<decimal>("Amount");

            if (budget < amount)
            {
                throw new Exception("Сумма продажи должна быть меньше бюджета продажи.");
            }
        }
    }
}

