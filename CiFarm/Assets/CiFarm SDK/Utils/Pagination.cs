using System;
using System.Collections.Generic;
using UnityEngine;

namespace CiFarm.Utils
{
    [Serializable]
    public class Pagination<TEntity>
        where TEntity : class, new()
    {
        [field: SerializeField]
        public int CurrentPage { get; set; }

        [field: SerializeField]
        public int TotalPages { get; set; }

        [field: SerializeField]
        public List<TEntity> Items { get; set; }

        public Pagination() { }

        public Pagination(List<TEntity> items, int page, int limit, int total)
        {
            if (limit == 0)
            {
                throw new ArgumentException("Limit cannot be zero");
            }
            Items = items;
            CurrentPage = page;
            TotalPages = Math.Max(1, (int)Math.Ceiling((double)total / limit));
        }
    }
}
