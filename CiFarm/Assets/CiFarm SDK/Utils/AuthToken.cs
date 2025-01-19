using UnityEngine;

namespace CiFarm.Utils
{
    public static class AuthToken
    {
        private static readonly string ACCESS_TOKEN_KEY = "AccessToken";
        private static readonly string REFRESH_TOKEN_KEY = "RefreshToken";

        // Static method to save tokens
        public static void Save(string accessToken, string refreshToken)
        {
            if (!string.IsNullOrEmpty(accessToken))
            {
                PlayerPrefs.SetString(ACCESS_TOKEN_KEY, accessToken);
            }

            if (!string.IsNullOrEmpty(refreshToken))
            {
                PlayerPrefs.SetString(REFRESH_TOKEN_KEY, refreshToken);
            }

            // Save changes to PlayerPrefs
            PlayerPrefs.Save();
        }

        // Static method to get the access token
        public static string GetAccessToken()
        {
            return PlayerPrefs.GetString(ACCESS_TOKEN_KEY, string.Empty); // Default to empty string if not found
        }

        // Static method to get the refresh token
        public static string GetRefreshToken()
        {
            return PlayerPrefs.GetString(REFRESH_TOKEN_KEY, string.Empty); // Default to empty string if not found
        }

        // Static method to clear the tokens
        public static void ClearTokens()
        {
            PlayerPrefs.DeleteKey(ACCESS_TOKEN_KEY);
            PlayerPrefs.DeleteKey(REFRESH_TOKEN_KEY);
        }
    }
}
