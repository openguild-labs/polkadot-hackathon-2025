using UnityEngine;

namespace DuckSurvivor.Scripts.Services
{
    public class DisplayService : MonoBehaviour
    {
        [SerializeField] private GameObject changeOrientationGO;
        private void Awake()
        {
            changeOrientationGO.SetActive(false);
        }
        public void SetOrientation(int orient)
        {
            ScreenOrientation orientation = (ScreenOrientation)orient;
            //the 'if' is obviously unnecessary. I'm just testing if the comparisons are working as expected. It's an example after all, might as well be thorough.
            if (orientation == ScreenOrientation.Portrait
                || orientation == ScreenOrientation.PortraitUpsideDown)
            {
                changeOrientationGO.SetActive(false);
            }
            else
            {
                if (Application.isMobilePlatform)
                {
                    changeOrientationGO.SetActive(true);
                }
                else
                {
                    changeOrientationGO.SetActive(false);
                }
            }
        }
    }
}
