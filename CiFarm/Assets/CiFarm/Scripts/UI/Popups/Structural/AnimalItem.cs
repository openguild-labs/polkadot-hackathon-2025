using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.Popups.Structural
{
    public class AnimalItem : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI timerGrow;
        [SerializeField] private Image           animalIcon;
        [SerializeField] private GameObject      nftIc;

        [SerializeField] private GameObject animalGroup;
        [SerializeField] private GameObject addButton;

        private GameObject  spineAnimal;
        private UnityAction onClickAnimal;

        public void SetAnimal(bool isNft, Sprite animalSpriteIcon = null, GameObject spineModel = null,
            UnityAction onClickAnimalAction = null)
        {
            onClickAnimal = onClickAnimalAction;
            animalGroup.SetActive(true);
            addButton.SetActive(false);
            nftIc.SetActive(isNft);

            // Setting animal display
            if (spineAnimal)
            {
                Destroy(spineAnimal);
            }

            animalIcon.SetActive(false);

            if (animalSpriteIcon != null)
            {
                animalIcon.SetActive(true);
                animalIcon.sprite = animalSpriteIcon;
            }

            if (spineModel != null)
            {
                animalIcon.SetActive(false);
                spineAnimal                      = Instantiate(spineModel, animalGroup.transform);
                spineAnimal.transform.position   = animalIcon.transform.position;
                spineAnimal.transform.localScale = Vector3.one;
            }
        }

        public void OnClickAnimal()
        {
            onClickAnimal?.Invoke();
        }

        public void SetEmpty()
        {
            animalGroup.SetActive(false);
            addButton.SetActive(true);
            if (spineAnimal)
            {
                Destroy(spineAnimal);
            }
        }
    }
}