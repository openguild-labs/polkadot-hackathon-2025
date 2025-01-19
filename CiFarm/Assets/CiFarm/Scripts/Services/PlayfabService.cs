// using LocalDatabase.Items;
// using PlayFab;
// using PlayFab.ClientModels;
// using System;
// using System.Collections.Generic;
// using UnityEngine;
// using UnityEngine.Events;
// using Utility.Singleton;
//
// namespace Services
// {
//     public class PlayfabService : PersistentMonoSingleton<PlayfabService>
//     {
//         [SerializeField] private string leaderBoardId;
//         [SerializeField] private string titleId;
//         public string Email { get; set; }
//         public string PlayFabId { get; set; }
//         public string DisplayName { get; set; }
//         public UserProperty UserProperty { get; set; }
//         public GameData GameData { get; set; } = null;
//         public Action OnLogout;
//         public Action OnGetDataSuccess;
//         public Action OnGetGameDataSuccess;
//         public Action OnGetReferralPointSuccess;
//         public Action OnDataChanged;
//         public Action<int> OnPointChanged;
//         public Action OnCreateNewUserData;
//         public Action OnClosePopup;
//
//         protected override void OnInitialized()
//         {
//             base.OnInitialized();
//             PlayFabSettings.staticSettings.TitleId = titleId;
//             Email = string.Empty;
//             PlayFabId = string.Empty;
//             DisplayName = string.Empty;
//             UserProperty = null;
//             GameData = null;
//         }
//
//         public void Reset()
//         {
//             PlayFabClientAPI.ForgetAllCredentials();
//             Email = string.Empty;
//             PlayFabId = string.Empty;
//             DisplayName = string.Empty;
//             UserProperty = null;
//             GameData = null;
//             OnLogout?.Invoke();
//         }
//
//         public void LoadAccountData()
//         {
//             PlayFabClientAPI.GetAccountInfo(new GetAccountInfoRequest(),
//                 o => { this.Email = o.AccountInfo.PrivateInfo.Email; }, OnError);
//         }
//
//         public void Login(string email, string password, Action<LoginResult> result, Action<PlayFabError> error)
//         {
//             var request = new LoginWithEmailAddressRequest
//             {
//                 Email = email,
//                 Password = password,
//                 InfoRequestParameters = new GetPlayerCombinedInfoRequestParams
//                 {
//                     GetCharacterInventories = false,
//                     GetCharacterList = false,
//                     GetPlayerProfile = true,
//                     GetPlayerStatistics = false,
//                     GetTitleData = false,
//                     GetUserAccountInfo = true,
//                     GetUserData = false,
//                     GetUserInventory = false,
//                     GetUserReadOnlyData = false,
//                     GetUserVirtualCurrency = false,
//                     PlayerStatisticNames = null,
//                     ProfileConstraints = null,
//                     TitleDataKeys = null,
//                     UserDataKeys = null,
//                     UserReadOnlyDataKeys = null
//                 },
//             };
//
//             PlayFabClientAPI.LoginWithEmailAddress(request, o =>
//             {
//                 if (o.InfoResultPayload.PlayerProfile != null)
//                 {
//                     DisplayName = o.InfoResultPayload.PlayerProfile.DisplayName;
//                 }
//
//                 Email = o.InfoResultPayload.AccountInfo.PrivateInfo.Email;
//                 result?.Invoke(o);
//             }, error);
//         }
//
//         public void Register(string email, string username, string password, Action<RegisterPlayFabUserResult> result,
//             Action<PlayFabError> onError, Action<string> error)
//         {
//             if (password.Length < 6)
//             {
//                 error?.Invoke("Password too short");
//                 return;
//             }
//
//             var request = new RegisterPlayFabUserRequest
//             {
//                 Email = email,
//                 Username = username,
//                 Password = password,
//                 DisplayName = username,
//                 RequireBothUsernameAndEmail = true
//             };
//             PlayFabClientAPI.RegisterPlayFabUser(request, result, onError);
//         }
//
//         public void LoginWithCustomId(string id, Action<LoginResult> result, Action<PlayFabError> onError)
//         {
//             var request = new LoginWithCustomIDRequest
//             {
//                 CreateAccount = false,
//                 CustomId = id,
//                 InfoRequestParameters = new GetPlayerCombinedInfoRequestParams
//                 {
//                     GetCharacterInventories = false,
//                     GetCharacterList = false,
//                     GetPlayerProfile = true,
//                     GetPlayerStatistics = false,
//                     GetTitleData = false,
//                     GetUserAccountInfo = true,
//                     GetUserData = false,
//                     GetUserInventory = false,
//                     GetUserReadOnlyData = false,
//                     GetUserVirtualCurrency = false,
//                     PlayerStatisticNames = null,
//                     ProfileConstraints = null,
//                     TitleDataKeys = null,
//                     UserDataKeys = null,
//                     UserReadOnlyDataKeys = null
//                 },
//             };
//
//             PlayFabClientAPI.LoginWithCustomID(request, o =>
//             {
//                 result.Invoke(o);
//                 if (o.InfoResultPayload.PlayerProfile != null)
//                 {
//                     DisplayName = o.InfoResultPayload.PlayerProfile.DisplayName;
//                 }
//
//                 Email = o.InfoResultPayload.AccountInfo.PrivateInfo.Email;
//             }, onError);
//         }
//
//         public void LinkCustomIdToAccount(string id, Action<LinkCustomIDResult> result, Action<PlayFabError> onError)
//         {
//             var request = new LinkCustomIDRequest
//             {
//                 CustomId = id,
//                 ForceLink = false,
//             };
//             PlayFabClientAPI.LinkCustomID(request, result, onError);
//         }
//
//         public void SendLeaderBoard(int score, Action<UpdatePlayerStatisticsResult> onSuccess)
//         {
//             var request = new UpdatePlayerStatisticsRequest
//             {
//                 Statistics = new List<StatisticUpdate>
//                 {
//                     new StatisticUpdate
//                     {
//                         StatisticName = leaderBoardId,
//                         Value = score
//                     }
//                 }
//             };
//             PlayFabClientAPI.UpdatePlayerStatistics(request, onSuccess, OnError);
//         }
//
//         public void GetLeaderBoard(Action<GetLeaderboardResult> result, int startPos = 0, int maxPos = 10)
//         {
//             var request = new GetLeaderboardRequest
//             {
//                 StatisticName = leaderBoardId,
//                 StartPosition = startPos,
//                 MaxResultsCount = maxPos
//             };
//             PlayFabClientAPI.GetLeaderboard(request, result, OnError);
//         }
//
//         public void SaveGameData(Action<UpdateUserDataResult> result, Action<PlayFabError> error)
//         {
//             if (GameData == null) return;
//             SaveUserData<GameData>(Constants.GameDataKey, GameData, result, error);
//             OnDataChanged?.Invoke();
//         }
//
//         public void SaveUserData<T>(
//             string key,
//             T dataObject,
//             Action<UpdateUserDataResult> result, Action<PlayFabError> error = null)
//         {
//             var request = new UpdateUserDataRequest
//             {
//                 Data = new Dictionary<string, string>
//                 {
//                     {
//                         key, JsonUtility.ToJson(dataObject)
//                     }
//                 }
//             };
//             if (error == null)
//             {
//                 PlayFabClientAPI.UpdateUserData(request, result, OnError);
//             }
//             else
//             {
//                 PlayFabClientAPI.UpdateUserData(request, result, error);
//             }
//         }
//
//         public void SaveUserData<T1, T2>(string key1, T1 dataObject1, string key2, T2 dataObject2,
//             Action<UpdateUserDataResult> result)
//         {
//             var request = new UpdateUserDataRequest
//             {
//                 Data = new Dictionary<string, string>
//                 {
//                     {
//                         key1, JsonUtility.ToJson(dataObject1)
//                     },
//                     {
//                         key2, JsonUtility.ToJson(dataObject2)
//                     }
//                 }
//             };
//             PlayFabClientAPI.UpdateUserData(request, result, OnError);
//         }
//
//         public void UpdateUserProperty(Action<UpdateUserDataResult> result)
//         {
//             if (UserProperty == null) return;
//             SaveUserData(Constants.UserPropertyKey, UserProperty, result);
//         }
//
//         public void SaveNewGame(Action<UpdateUserDataResult> result)
//         {
//             SaveUserData<UserProperty, GameData>(
//                 Constants.UserPropertyKey,
//                 new UserProperty(),
//                 Constants.GameDataKey,
//                 new GameData(),
//                 result);
//         }
//         //public void SaveNewUserProperty(Action<UpdateUserDataResult> result)
//         //{
//         //    SaveUserData(Constants.UserPropertyKey, new UserProperty(), result);
//         //}
//
//         public void GetUserProperty()
//         {
//             PlayFabClientAPI.GetUserData(new GetUserDataRequest(), OnUserPropertyReceived, OnError);
//         }
//
//         private void OnUserPropertyReceived(GetUserDataResult result)
//         {
//             if (result.Data != null)
//             {
//                 if (result.Data.ContainsKey(Constants.UserPropertyKey) == false
//                     && result.Data.ContainsKey(Constants.GameDataKey) == false)
//                 {
//                     SaveNewGame((result) =>
//                     {
//                         UserProperty = new();
//                         GameData = new();
//                         OnGetDataSuccess?.Invoke();
//                     });
//                 }
//                 else if (result.Data.ContainsKey(Constants.UserPropertyKey) == false)
//                 {
//                     SaveUserData<UserProperty>(Constants.UserPropertyKey, new UserProperty(),
//                         (result) =>
//                         {
//                             UserProperty = new();
//                             OnGetDataSuccess?.Invoke();
//                         });
//                     GameData = JsonUtility.FromJson<GameData>(result.Data[Constants.GameDataKey].Value);
//                 }
//                 else if (result.Data.ContainsKey(Constants.GameDataKey) == false)
//                 {
//                     SaveUserData<GameData>(Constants.GameDataKey, new GameData(),
//                         (result) =>
//                         {
//                             GameData = new();
//                             OnGetDataSuccess?.Invoke();
//                         });
//                     UserProperty = JsonUtility.FromJson<UserProperty>(result.Data[Constants.UserPropertyKey].Value);
//                 }
//                 else
//                 {
//                     UserProperty = JsonUtility.FromJson<UserProperty>(result.Data[Constants.UserPropertyKey].Value);
//                     GameData = JsonUtility.FromJson<GameData>(result.Data[Constants.GameDataKey].Value);
//                     OnGetDataSuccess?.Invoke();
//                 }
//             }
//             else
//             {
//                 SaveNewGame((result) =>
//                 {
//                     UserProperty = new();
//                     GameData = new();
//                     OnGetDataSuccess?.Invoke();
//                 });
//             }
//         }
//         public void ResetBonus()
//         {
//             GameData.CanClaim = 1;
//             GameData.DayInWeek = 0;
//         }
//
//         //public void ResetPointLeft()
//         //{
//         //    UserProperty.DailyPointLeft = 20000;
//         //}
//
//         private void OnError(PlayFabError error)
//         {
//             Logger.Error("khann " + error.GenerateErrorReport());
//             //PopupHelpers.ShowError(Constants.CommonErrorStr);
//         }
//
//         public void UpdateUserName(string userNameText, Action onUpdated, Action<string> action)
//         {
//             PlayFabClientAPI.UpdateUserTitleDisplayName(new UpdateUserTitleDisplayNameRequest
//             {
//                 DisplayName = userNameText
//             }, o =>
//             {
//                 DisplayName = o.DisplayName;
//                 onUpdated.Invoke();
//             }, o => { action.Invoke(o.ErrorMessage); });
//         }
//
//         public bool SaveEndGame(int level, int star, Action onLevelUp)
//         {
//             ResourceService resourceService = ResourceService.Instance;
//             int gold = 0;
//             int diamond = 0;
//             bool isClear = false;
//             if (GameData.Stars[level] <= 0)
//             {
//                 diamond = resourceService.LevelsData.GameLevels[level].GemReward;
//             }
//             else
//             {
//                 isClear = true;
//             }
//
//             gold = resourceService.LevelsData.GameLevels[level].CoinReward;
//             int exp = resourceService.LevelsData.GameLevels[level].XpReward;
//             GameData.Gold += gold;
//             GameData.Diamond += diamond;
//             GameData.EXP += exp;
//             if (star > GameData.Stars[level])
//             {
//                 GameData.Stars[level] = star;
//             }
//
//             var newLevel = resourceService.CharacterLevelsData.GetCurrentLevel(GameData.EXP);
//             if (newLevel.Level > GameData.Level)
//             {
//                 // LEVEL UP ACTION?
//                 GameData.Level = newLevel.Level;
//                 onLevelUp?.Invoke();
//             }
//
//             return isClear;
//         }
//         public void ClaimDailyBonus(UnityAction<bool> fetchSuccess, UnityAction fetchError)
//         {
//             ExecuteCloudScriptRequest request = new()
//             {
//                 FunctionName = "CanRewardBonus",
//                 GeneratePlayStreamEvent = true,
//                 FunctionParameter = new
//                 {
//
//                 }
//             };
//             PlayFabClientAPI.ExecuteCloudScript(request, result =>
//             {
//                 ClaimDailyBonusCheckResponse response =
//                     JsonUtility.FromJson<ClaimDailyBonusCheckResponse>(result.FunctionResult.ToString());
//
//                 if (response == null)
//                 {
//                     fetchError.Invoke();
//                 }
//
//                 SyncMaxScoreDataCounter();
//                 fetchSuccess.Invoke(response.canReward == 1);
//             }, error => { fetchError.Invoke(); });
//         }
//
//         private void SyncMaxScoreDataCounter()
//         {
//             //PlayFabClientAPI.GetUserReadOnlyData(new GetUserDataRequest
//             //{
//             //    Keys = new List<string>()
//             //    {
//             //        //TOTAL_POINT,
//             //        //CHECK_TRANSFER_POINT
//             //    },
//             //}, result =>
//             //{
//             //    if (result.Data.ContainsKey(CHECK_TRANSFER_POINT))
//             //    {
//             //        if (result.Data.ContainsKey(TOTAL_POINT))
//             //        {
//             //            var currentPoint = int.Parse(result.Data[TOTAL_POINT].Value);
//             //            DataCounter.MaxScore = currentPoint;
//             //            SaveDataCounter((o) => { });
//             //            OnPointChanged?.Invoke(DataCounter.MaxScore);
//             //        }
//             //    }
//             //}, o => { });
//         }
//     }
//
//     public class UserProperty
//     {
//         public bool IsReferred = false;
//     }
//
//     public class GameData
//     {
//         // User property
//         public string CurrentDay = DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm:ss");
//         public int TotalPoint = 0;
//         public int DailyPointLeft = 20000;
//         public int DayInWeek = 0;
//         public int CanClaim = 1;
//         public List<DayState> DailyBonus = new()
//         {
//             DayState.NotCollect,
//             DayState.Normal,
//             DayState.Normal,
//             DayState.Normal,
//             DayState.Normal,
//             DayState.Normal,
//             DayState.Normal
//         };
//         // Gamedata
//         public bool IsSelect = false;
//         public string Body;
//         public string Head = "Common.Basic.Head.Human";
//         public string Hair = "Common.Basic.Hair.BuzzCut";
//         public string Beard;
//         public string Eyebrows = "Common.Basic.Eyebrows.Eyebrows1";
//         public string Eyes = "Common.Basic.Eyes.Male";
//         public string Ears = "Common.Basic.Ears.HumanEars";
//         public string Mouth = "Common.Basic.Mouth.Normal";
//         public string Earings;
//         public string Mask;
//         public string Glasses;
//         public string Supplies;
//         public Color ColorBody = new(1.0f, 0.784f, 0.471f);
//         public Color ColorHead = Color.white;
//         public Color ColorHair = new(0.588f, 0.196f, 0.0f);
//         public Color ColorBeard = new(0.588f, 0.196f, 0.0f);
//         public Color ColorEyebrows = Color.white;
//         public Color ColorEyes = new(0.0f, 0.784f, 1.0f);
//         public Color ColorEars = Color.white;
//
//         public bool IsPair = false;
//         public string WeaponA = string.Empty;
//         public string WeaponA2 = string.Empty;
//         public string WeaponB = string.Empty;
//         public string Shield = string.Empty;
//
//         public string EquipHelmet = string.Empty;
//         public string EquipArmor = string.Empty;
//
//         public int Gold = 0;
//         public int Diamond = 0;
//         public int Level = 0;
//         public int EXP = 0;
//         public List<int> Stars = new();
//         public List<string> OwnedWeapon = new();
//         public List<string> OwnedShield = new();
//         public List<string> OwnedHelmet = new();
//         public List<string> OwnedArmor = new();
//     }
//
//     public enum DayState
//     {
//         NotCollect,
//         Normal,
//         Collected
//     }
//     [Serializable]
//     public class ClaimDailyBonusCheckResponse
//     {
//         public int canReward;
//     }
// }