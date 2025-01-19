#if PUN2

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Photon.Realtime;
using Hashtable = ExitGames.Client.Photon.Hashtable;

public static class PhotonExtentions {

	/// <summary>
	/// Set custom properties, one propery.
	/// </summary>
	/// <param name="player">Photon player</param>
	/// <param name="args">Params: args[0] - key, args[1] - value ... etc.</param>
	public static void SetCustomProperties (this Player player, object key, object value)
	{
		var hashtable = new Hashtable ();
		hashtable.Add (key, value);
		player.SetCustomProperties (hashtable);
	}


	/// <summary>
	/// Set custom properties, properies from params
	/// </summary>
	/// <param name="player">Photon player</param>
	/// <param name="args">Params: args[0] - key, args[1] - value ... etc.</param>
	public static void SetCustomProperties (this Player player, params object[] args)
	{
		var hashtable = new Hashtable ();

		for (int i = 0; i < args.Length; i += 2)
		{
			hashtable.Add (args[i], args[i + 1]);
		}
		
		player.SetCustomProperties (hashtable);
	}

}

#endif