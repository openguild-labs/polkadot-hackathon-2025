using System;

namespace CiFarm.GraphQL
{
    [Serializable]
    public class GetInventoriesArgs : PaginatedArgs { }

    [Serializable]
    public class GetPlacedItemsArgs : PaginatedArgs { }

    [Serializable]
    public class GetDeliveringProductsArgs : PaginatedArgs { }
}
