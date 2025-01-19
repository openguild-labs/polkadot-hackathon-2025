using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    // Represents a user following another user
    [Serializable]
    public class UsersFollowingUsersEntity : UuidAbstractEntity
    {
        // Public properties for UsersFollowingUsersEntity with SerializeField attributes

        [JsonProperty("followerId")]
        [field: SerializeField]
        public string FollowerId { get; set; }

        [JsonProperty("followeeId")]
        [field: SerializeField]
        public string FolloweeId { get; set; }
    }
}
