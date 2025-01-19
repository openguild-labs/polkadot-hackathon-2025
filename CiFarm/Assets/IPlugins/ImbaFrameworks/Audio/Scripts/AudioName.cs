using UnityEngine;

namespace Imba.Audio
{
    [SerializeField]
    public enum AudioName
    {
        // Main Music
        Track_1 = -2,

        NoSound = -1,

        BGM_Menu     = 0,
        BGM_GAMEPLAY = 1,

        #region UI

        #endregion

        #region GAME PLAY

        Appear1,
        Appear2,
        Click1,
        Click2,
        Click3,
        Click4,
        Click5,
        Close1,
        Close2,
        Close3,
        PowerUpBright,
        Watering,
        Spray,
   

        #endregion
    }

    public enum AudioType
    {
        SFX = 0,
        BGM = 1,
        AMB = 2,
    }
}