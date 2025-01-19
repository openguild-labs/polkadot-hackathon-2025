using System.Collections;
using System.Collections.Generic;
using CiFarm;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Imba.Utils;
using UnityEngine;

public class CiFarmSDKManager : ManualSingletonMono<CiFarmSDKManager>
{
    public IEnumerator Start()
    {
        yield return new WaitUntil(() => CiFarmSDK.Instance != null);
        CiFarmSDK.Instance.Authenticate();
        FetchAnimals();
    }

    public async void FetchAnimals()
    {
        var animals = await CiFarmSDK.Instance.GraphQLClient.QueryAnimalsAsync();
        ConsoleLogger.LogSuccess($"Fetched {animals.Count} animals");
    }
}
