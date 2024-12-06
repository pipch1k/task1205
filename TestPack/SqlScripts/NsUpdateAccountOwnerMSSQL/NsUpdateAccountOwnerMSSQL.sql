    UPDATE Account
    SET OwnerId = NULL
    FROM Account
    WHERE CreatedOn < DATEADD(WEEK, -1, GETDATE());