using UnityEngine;
using UnityEngine.SceneManagement;

namespace SupernovaDriver.Scripts.SceneController.Main
{
    public class MainController : MonoBehaviour
    {

        private void Awake()
        {
            // Get services
            if (GameObject.FindGameObjectWithTag(Constants.ServicesTag) != null)
            {
                GameObject gameServiceObject = GameObject.FindGameObjectWithTag(Constants.ServicesTag);
            }
            else
            {
                SceneManager.LoadScene(Constants.EntryScene);
            }
        }
        private void Start()
        {
            Debug.Log("Start");
                        SceneManager.LoadScene(Constants.GameScene);

        }
        public void StartMatchMaking()
        {

        }
        
    }
}